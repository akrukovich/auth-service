import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '../config/config.service';
import { RedisConfig } from '../config/interfaces/redis-config.interface';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly client: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.client = new Redis(this.getConfig());
  }

  private getConfig(): RedisConfig {
    return this.configService.getRedisConfigService().getConfig();
  }

  onModuleInit(): void {
    this.client.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.client.on('error', (e) => {
      this.logger.error('Redis error', e);
    });
  }

  onModuleDestroy(): void {
    this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async setWithTll(key: string, ttl: number, value: string): Promise<void> {
    await this.client.setex(key, ttl, value);
  }

  async delete(id: string): Promise<void> {
    await this.client.del(id);
  }
}
