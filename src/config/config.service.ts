import { Injectable } from '@nestjs/common';
import { DBConfigService } from './db-config.service';
import { EnvConfigService } from './env-config.service';
import { AuthConfigService } from './auth-config.service';
import { RedisConfigService } from './redis-config.service';

@Injectable()
export class ConfigService {
  constructor(
    private readonly dbConfigService: DBConfigService,
    private readonly envConfigService: EnvConfigService,
    private readonly authConfigService: AuthConfigService,
    private readonly redisConfigService: RedisConfigService,
  ) {}

  getDBConfigService(): DBConfigService {
    return this.dbConfigService;
  }

  getEnvConfigService(): EnvConfigService {
    return this.envConfigService;
  }

  getAuthConfigService(): AuthConfigService {
    return this.authConfigService;
  }

  getRedisConfigService(): RedisConfigService {
    return this.redisConfigService;
  }
}
