import { AnniversaryModel } from '@domain/model/database/anniversary';
import { CoupleChannelModel } from '@domain/model/database/couple-channel';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Anniversary } from './anniversary.entity';
import { CoupleChannel } from './couple-channel.entity';

@Entity()
export class CoupleInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', nullable: true })
  loveday: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => CoupleChannel, (coupleChannel) => coupleChannel.couple_info)
  couple_channel: CoupleChannelModel;

  @OneToMany(() => Anniversary, (anniversary) => anniversary.couple_info)
  anniversaries: AnniversaryModel[];
}
