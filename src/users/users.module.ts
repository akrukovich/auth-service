import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './repositories/user.repository';
import { PasswordHistoryRepository } from './repositories/password-history.repository';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository, PasswordHistoryRepository],
  exports: [UserRepository, UsersService, PasswordHistoryRepository],
  imports: [LoggerModule],
})
export class UsersModule {}
