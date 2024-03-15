import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.findOne({ where: { username } });
  }

  async findOneById(id: number): Promise<UserEntity | null> {
    return this.findOne({ where: { id } });
  }
}
