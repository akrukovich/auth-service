import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '../config/config.module';
import { LoggerModule } from '../logger/logger.module';

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
  imports: [ConfigModule, LoggerModule],
})
export class RedisModule {}
