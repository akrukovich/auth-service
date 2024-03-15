import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from './repositories/user.repository';
import { UserEntity } from './entities/user.entity';
import { PasswordHistoryEntity } from './entities/password-history.entity';
import { DataSource } from 'typeorm';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepo: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(username: string, password: string): Promise<void> {
    if (await this.userRepo.findByUsername(username)) {
      throw new BadRequestException(`user ${username} already exists`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.username = username;
      const { id: userId } = await queryRunner.manager.save(UserEntity, user);

      const passwordHistory = new PasswordHistoryEntity();
      passwordHistory.userId = userId;
      passwordHistory.hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
      await queryRunner.manager.save(PasswordHistoryEntity, passwordHistory);

      await queryRunner.commitTransaction();

      this.logger.log(`new user signed up`);
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findUserByIdOrThrowNotFound(id: number): Promise<UserEntity | never> {
    const user = await this.userRepo.findOneById(id);
    if (!user) {
      throw new NotFoundException(`user by id:${id} not found`);
    }

    return user;
  }
}
