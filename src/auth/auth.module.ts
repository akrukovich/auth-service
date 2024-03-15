import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.getAuthConfigService().getJwtSecret(),
        signOptions: { expiresIn: configService.getAuthConfigService().getAccessTokenTtl() },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    LoggerModule,
  ],
})
export class AuthModule {}
