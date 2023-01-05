import { DevicePlatformEnum } from '@domain/common/enums/device-platform';
import { UserModel } from '@domain/model/database/user';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Device {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', nullable: true })
  device_token: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  device_token_timestamp: Date | null;

  @Column({ type: 'enum', enum: DevicePlatformEnum })
  platform: DevicePlatformEnum;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.device)
  user: UserModel;
}
