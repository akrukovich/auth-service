import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class DBConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  getDBUsername(): string {
    return this.nestConfigService.get<string>('DB_USER')!;
  }

  getDBPassword(): string {
    return this.nestConfigService.get<string>('DB_PASSWORD')!;
  }

  getDBHost(): string {
    return this.nestConfigService.get<string>('DB_HOST')!;
  }

  getDBPort(): string {
    return this.nestConfigService.get<string>('DB_PORT')!;
  }

  getDBName(): string {
    return this.nestConfigService.get<string>('DB_NAME')!;
  }

  getDBUrl(): string {
    const username = this.getDBUsername();
    const password = this.getDBPassword();
    const host = this.getDBHost();
    const port = this.getDBPort();
    const name = this.getDBName();

    return `postgres://${username}:${password}@${host}:${port}/${name}`;
  }
}
