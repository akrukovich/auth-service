import { IsString, MaxLength, Matches, MinLength } from 'class-validator';
import { Credentials } from '../intefaces/credentials.interface';
import { ApiProperty } from '@nestjs/swagger';

const USERNAME_MAX_LENGTH = 50;
const USERNAME_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 50;

export class CredentialsDto implements Credentials {
  @IsString()
  @MaxLength(USERNAME_MAX_LENGTH)
  @MinLength(USERNAME_MIN_LENGTH)
  @Matches(/^[a-zA-Z0-9_-]*$/, {
    message: 'username must contain only alphanumeric characters, underscores, or dashes',
  })
  @ApiProperty()
  username: string;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password is too weak',
  })
  @MaxLength(PASSWORD_MAX_LENGTH)
  @ApiProperty()
  password: string;
}
