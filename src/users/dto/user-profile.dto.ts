import { ApiProperty } from '@nestjs/swagger';
import { User } from '../interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';

export class UserProfileDto implements User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.username = user.username;
  }
}
