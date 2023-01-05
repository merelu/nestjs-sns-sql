import { MessageType } from '@domain/common/enums/message.enum';
import { CoupleChannelModel } from '@domain/model/database/couple-channel';
import { UserModel } from '@domain/model/database/user';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoupleChannel } from './couple-channel.entity';
import { User } from './user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MessageType })
  type: MessageType;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'int', nullable: true })
  couple_channel_id: number | null;

  @ManyToOne(() => CoupleChannel, (coupleChannel) => coupleChannel.messages, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'couple_channel_id',
    referencedColumnName: 'id',
  })
  couple_channel: CoupleChannelModel;

  @Column({ type: 'int', nullable: true })
  sender_id: number | null;

  @ManyToOne(() => User, (user) => user.messages, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'sender_id',
    referencedColumnName: 'id',
  })
  sender: UserModel;
}
