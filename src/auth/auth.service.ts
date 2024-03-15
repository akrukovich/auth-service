import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Credentials } from './intefaces/credentials.interface';
import { UsersService } from '../users/users.service';
import { UserRepository } from '../users/repositories/user.repository';
import { PasswordHistoryRepository } from '../users/repositories/password-history.repository';
import { ConfigService } from '../config/config.service';
import { UserEntity } from '../users/entities/user.entity';
import { AuthConfigService } from '../config/auth-config.service';
import { AuthTokens } from './intefaces/auth-tokens.interface';
import { LoggerService } from '../logger/logger.service';
import { getAccessTokenKey, getRefreshTokenKey } from './auth.utils';
import { JwtPayload } from './intefaces/jwt-payload.interface';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userRepo: UserRepository,
    private readonly passwordHistoryRepo: PasswordHistoryRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly redis: RedisService,
    private readonly logger: LoggerService,
  ) {}

  private getAuthConfig(): AuthConfigService {
    return this.configService.getAuthConfigService();
  }

  private handleInvalidCredentials(): never {
    throw new BadRequestException('Invalid credentials');
  }

  async signUp({ username, password }: Credentials): Promise<void> {
    await this.usersService.createUser(username, password);
  }

  async signIn(credentials: Credentials): Promise<AuthTokens> {
    const user = await this.validateUser(credentials);
    const tokens = this.generateTokens(user);
    await this.cacheTokens(user.id, tokens);

    return tokens;
  }

  private async validateUser({ username, password }: Credentials): Promise<UserEntity> {
    const [user, latestPasswordHistory] = await Promise.all([
      this.userRepo.findByUsername(username),
      this.passwordHistoryRepo.findLatestPasswordByUsername(username),
    ]);

    if (
      !user ||
      !latestPasswordHistory ||
      !(await this.isPasswordValid(password, latestPasswordHistory.hashedPassword))
    ) {
      this.handleInvalidCredentials();
    }

    return user;
  }

  private async isPasswordValid(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateTokens(user: UserEntity): AuthTokens {
    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateRefreshToken(payload: JwtPayload): string {
    const authConfig = this.getAuthConfig();
    return this.jwtService.sign(payload, {
      secret: authConfig.getJwtRefreshSecret(),
      expiresIn: authConfig.getRefreshTokenTtl(),
    });
  }

  async refreshToken(user: UserEntity): Promise<AuthTokens> {
    const tokens = this.generateTokens(user);
    await this.cacheTokens(user.id, tokens);
    return tokens;
  }

  private async cacheTokens(id: number, { accessToken, refreshToken }: AuthTokens): Promise<void> {
    try {
      const authConfig = this.getAuthConfig();
      const accessTokenTtl = authConfig.getAccessTokenTtl();
      const refreshTokenTtl = authConfig.getRefreshTokenTtl();

      await Promise.all([
        this.redis.setWithTll(getAccessTokenKey(id), accessTokenTtl, accessToken),
        this.redis.setWithTll(getRefreshTokenKey(id), refreshTokenTtl, refreshToken),
      ]);
    } catch (e) {
      this.logger.error(`Error during tokens cache:`, e);
    }
  }

  async signOut({ id }: UserEntity): Promise<void> {
    try {
      await Promise.all([
        this.redis.delete(getAccessTokenKey(id)),
        this.redis.delete(getRefreshTokenKey(id)),
      ]);
    } catch (e) {
      this.logger.error(`Error during log out:`, e);
    }
  }
}
