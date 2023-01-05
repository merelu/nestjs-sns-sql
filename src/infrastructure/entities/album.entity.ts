import { CoupleChannelModel } from '@domain/model/database/couple-channel';
import { FeedModel } from '@domain/model/database/feed';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoupleChannel } from './couple-channel.entity';
import { Feed } from './feed.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => CoupleChannel, (coupleChannel) => coupleChannel.album)
  couple_channel: CoupleChannelModel;

  @OneToMany(() => Feed, (feed) => feed.album)
  feeds: FeedModel[];
}
