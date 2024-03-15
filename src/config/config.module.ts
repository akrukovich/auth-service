import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from './config.service';
import { DBConfigService } from './db-config.service';
import { EnvConfigService } from './env-config.service';
import { AuthConfigService } from './auth-config.service';
import { RedisConfigService } from './redis-config.service';

@Global()
@Module({
  imports: [NestConfigModule.forRoot({ isGlobal: true })],
  providers: [
    ConfigService,
    DBConfigService,
    EnvConfigService,
    AuthConfigService,
    RedisConfigService,
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
