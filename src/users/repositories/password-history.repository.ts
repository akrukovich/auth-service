import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PasswordHistoryEntity } from '../entities/password-history.entity';

@Injectable()
export class PasswordHistoryRepository extends Repository<PasswordHistoryEntity> {
  constructor(dataSource: DataSource) {
    super(PasswordHistoryEntity, dataSource.createEntityManager());
  }

  async findLatestPasswordByUsername(username: string): Promise<PasswordHistoryEntity | null> {
    return this.findOne({
      where: { user: { username } },
      order: { createdAt: 'DESC' },
    });
  }
}
