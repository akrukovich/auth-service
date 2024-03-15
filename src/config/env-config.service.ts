import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService {
  constructor(private readonly nestConfigService: NestConfigService) {}

  getPort(): number {
    return +this.nestConfigService.get<number>('PORT')!;
  }
}
