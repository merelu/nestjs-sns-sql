import { AccessTypeEnum } from '@domain/common/enums/access-type.enum';
import { AlbumModel } from '@domain/model/database/album';
import { FeedLikerModel } from '@domain/model/database/feed-liker';
import { PhotoModel } from '@domain/model/database/photo';
import { UserModel } from '@domain/model/database/user';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Album } from './album.entity';
import { FeedLiker } from './feed-likers.entity';
import { Photo } from './photo.entity';
import { User } from './user.entity';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: AccessTypeEnum })
  access_type: AccessTypeEnum;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'timestamp' })
  dating_date: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Photo, (photo) => photo.feed)
  photos: PhotoModel[];

  @ManyToMany(() => User, (user) => user.like_feeds)
  @JoinTable({
    name: 'feed_liker',
    joinColumn: {
      name: 'feed_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  likers: UserModel[];

  @OneToMany(() => FeedLiker, (feedLiker) => feedLiker.feed, {
    cascade: ['insert'],
  })
  feed_likers: FeedLikerModel[];

  @Column({ type: 'int', nullable: true })
  writer_id: number | null;

  @ManyToOne(() => User, (user) => user.feeds, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'writer_id', referencedColumnName: 'id' })
  writer: UserModel;

  @Column({ type: 'int', nullable: true })
  album_id: number | null;

  @ManyToOne(() => Album, (album) => album.feeds, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'album_id', referencedColumnName: 'id' })
  album: AlbumModel;

  @Column({ type: 'int', default: 0 })
  like_count: number;

  //virtual column
  is_liked: boolean;
}
