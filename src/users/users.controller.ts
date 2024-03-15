import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetAuthorizedUser } from '../shared/decorators/get-authorized-user.decorator';
import { UserEntity } from './entities/user.entity';
import { UserProfileDto } from './dto/user-profile.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('self')
  @ApiOkResponse({ type: UserProfileDto })
  @ApiBearerAuth()
  async findSelf(@GetAuthorizedUser() { id }: UserEntity): Promise<UserProfileDto> {
    const user = await this.usersService.findUserByIdOrThrowNotFound(id);
    return new UserProfileDto(user);
  }
}
