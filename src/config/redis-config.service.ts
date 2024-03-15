import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { RedisConfig } from './interfaces/redis-config.interface';

@Injectable()
export class RedisConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  getPort(): number {
    return +this.nestConfigService.get<number>('REDIS_PORT')!;
  }

  getHost(): string {
    return this.nestConfigService.get<string>('REDIS_HOST')!;
  }

  getConfig(): RedisConfig {
    const port = +this.getPort();
    const host = this.getHost();

    return { port, host };
  }
}
