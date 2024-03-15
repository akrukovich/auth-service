import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetAuthorizedUser } from '../shared/decorators/get-authorized-user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { AuthTokensDto } from './dto/auth-tokens.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() dto: CredentialsDto): Promise<void> {
    await this.authService.signUp(dto);
  }

  @Post('/signin')
  async signIn(@Body() dto: CredentialsDto): Promise<AuthTokensDto> {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/refresh-token')
  @ApiBearerAuth()
  async refreshToken(@GetAuthorizedUser() user: UserEntity): Promise<AuthTokensDto> {
    return this.authService.refreshToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/sign-out')
  @ApiBearerAuth()
  async signOut(@GetAuthorizedUser() user: UserEntity): Promise<void> {
    return this.authService.signOut(user);
  }
}
