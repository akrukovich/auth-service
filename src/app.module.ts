import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { UserEntity } from './users/entities/user.entity';
import { PasswordHistoryEntity } from './users/entities/password-history.entity';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getDBConfigService().getDBUrl(),
        entities: [UserEntity, PasswordHistoryEntity],
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    LoggerModule,
    RedisModule,
  ],
})
export class AppModule {}
