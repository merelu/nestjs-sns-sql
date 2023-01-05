import { AlbumModel } from '@domain/model/database/album';
import { CoupleInfoModel } from '@domain/model/database/couple-info';
import { MessageModel } from '@domain/model/database/message';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from './album.entity';
import { CoupleInfo } from './couple-info.entity';
import { Message } from './message.entity';
import { User } from './user.entity';

@Entity()
export class CoupleChannel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  code: string;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => User, (user) => user.couple_channel)
  users: User[];

  @Column({ type: 'int', nullable: true })
  couple_info_id: number | null;

  @OneToOne(() => CoupleInfo, (coupleInfo) => coupleInfo.couple_channel, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'couple_info_id' })
  couple_info: CoupleInfoModel;

  @Column({ type: 'int', nullable: true })
  album_id: number | null;

  @OneToOne(() => Album, (album) => album.couple_channel, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'album_id' })
  album: AlbumModel;

  @OneToMany(() => Message, (message) => message.couple_channel)
  messages: MessageModel[];
}
