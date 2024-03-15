import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  getJwtSecret(): string {
    return this.nestConfigService.get<string>('JWT_SECRET')!;
  }

  getJwtRefreshSecret(): string {
    return this.nestConfigService.get<string>('JWT_REFRESH_SECRET')!;
  }

  getAccessTokenTtl(): number {
    return +this.nestConfigService.get<number>('JWT_ACCESS_TOKEN_EXPIRES_IN')!;
  }

  getRefreshTokenTtl(): number {
    return +this.nestConfigService.get<number>('JWT_REFRESH_TOKEN_EXPIRES_IN')!;
  }
}
