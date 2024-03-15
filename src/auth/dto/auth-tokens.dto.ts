import { AuthTokens } from '../intefaces/auth-tokens.interface';
import { ApiProperty } from '@nestjs/swagger';

export class AuthTokensDto implements AuthTokens {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
