import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PasswordHistoryEntity } from './password-history.entity';
import { User } from '../interfaces/user.interface';

@Entity({ name: 'users' })
export class UserEntity implements User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 50, type: 'varchar' })
  username: string;

  @OneToMany(() => PasswordHistoryEntity, (password) => password.user)
  passwords?: PasswordHistoryEntity[];
}
