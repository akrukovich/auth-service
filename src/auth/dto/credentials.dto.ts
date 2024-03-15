import { IsString, MaxLength, Matches, MinLength } from 'class-validator';
import { Credentials } from '../intefaces/credentials.interface';
import { ApiProperty } from '@nestjs/swagger';

const USERNAME_MAX_LENGTH = 50;
const USERNAME_MIN_LENGTH = 6;
const PASSWORD_MAX_LENGTH = 50;
const PASSWORD_MIN_LENGTH = 8;

const passwordRegex = new RegExp(
    `(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\\W]).{${PASSWORD_MIN_LENGTH},${PASSWORD_MAX_LENGTH}}`
);

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
  @Matches(passwordRegex, {
    message: 'Password must include at least one lowercase letter, one uppercase letter, one number, and one special character.',
  })
  @MaxLength(PASSWORD_MAX_LENGTH)
  @MinLength(PASSWORD_MIN_LENGTH)
  @ApiProperty()
  password: string;
}
