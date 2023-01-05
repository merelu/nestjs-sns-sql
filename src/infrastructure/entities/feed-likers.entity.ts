import { FeedModel } from '@domain/model/database/feed';
import { UserModel } from '@domain/model/database/user';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { Feed } from './feed.entity';
import { User } from './user.entity';

@Index('user_id', ['user_id'], {})
@Entity({ name: 'feed_liker' })
export class FeedLiker {
  @DeleteDateColumn()
  deleted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column('int', { primary: true, name: 'feed_id' })
  feed_id: number;

  @ManyToOne(() => Feed, (feed) => feed.feed_likers, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'feed_id', referencedColumnName: 'id' })
  feed: FeedModel;

  @Column('int', { primary: true, name: 'user_id' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.feed_likers, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserModel;
}
