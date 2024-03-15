import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'password_history' })
export class PasswordHistoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id', type: 'integer' })
  userId: number;

  @Column({ name: 'hashed_password', type: 'text' })
  hashedPassword: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.passwords)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
