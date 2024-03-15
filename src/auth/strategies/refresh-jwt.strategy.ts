import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '../../config/config.service';
import { JwtPayload } from '../intefaces/jwt-payload.interface';
import { UserEntity } from '../../users/entities/user.entity';
import { getRefreshTokenKey } from '../auth.utils';
import { UserRepository } from '../../users/repositories/user.repository';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getAuthConfigService().getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<UserEntity | boolean> {
    const id = payload.sub;
    const extractedToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const cachedToken = await this.redis.get(getRefreshTokenKey(id));
    if (extractedToken !== cachedToken) {
      return false;
    }

    const user = await this.userRepo.findOneById(id);
    if (!user) {
      return false;
    }

    return user;
  }
}
