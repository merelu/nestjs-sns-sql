import { AuthTypeEnum } from '@domain/common/enums/user/auth-type.enum';
import { UserStatusEnum } from '@domain/common/enums/user/user-status.enum';
import { CoupleChannelModel } from '@domain/model/database/couple-channel';
import { DeviceModel } from '@domain/model/database/device';
import { FeedModel } from '@domain/model/database/feed';
import { FeedLikerModel } from '@domain/model/database/feed-liker';
import { MessageModel } from '@domain/model/database/message';
import { ProfileModel } from '@domain/model/database/profile';
import { ProfileImageModel } from '@domain/model/database/profile-image';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CoupleChannel } from './couple-channel.entity';
import { Device } from './device.entity';
import { FeedLiker } from './feed-likers.entity';
import { Feed } from './feed.entity';
import { Message } from './message.entity';
import { ProfileImage } from './profile-image.entity';
import { Profile } from './profile.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({
    type: 'enum',
    enum: UserStatusEnum,
    default: UserStatusEnum.active,
  })
  status: UserStatusEnum;

  @Column({ type: 'enum', enum: AuthTypeEnum })
  auth_type: AuthTypeEnum;

  @Column({ type: 'varchar' })
  oauth_user_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_login_at: Date;

  @Column({ type: 'boolean', default: false })
  push_agree: boolean;

  @DeleteDateColumn()
  deleted_at!: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'int', nullable: true })
  profile_id: number | null;

  @OneToOne(() => Profile, (profile) => profile.user, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'profile_id' })
  profile: ProfileModel;

  @Column({
    type: 'int',
    nullable: true,
  })
  profile_image_id: number | null;

  @OneToOne(() => ProfileImage, (profileImage) => profileImage.user)
  @JoinColumn({ name: 'profile_image_id', referencedColumnName: 'id' })
  profile_image: ProfileImageModel;

  @Column({ type: 'int', nullable: true })
  device_id: number | null;

  @OneToOne(() => Device, (device) => device.user, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: DeviceModel;

  @Column({ type: 'int', nullable: true })
  couple_channel_id: number | null;

  @ManyToOne(() => CoupleChannel, (coupleChannel) => coupleChannel.users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'couple_channel_id', referencedColumnName: 'id' })
  couple_channel: CoupleChannelModel;

  @OneToMany(() => Message, (message) => message.sender)
  messages: MessageModel[];

  @ManyToMany(() => Feed, (feed) => feed.likers)
  like_feeds: FeedModel[];

  @OneToMany(() => Feed, (feed) => feed.writer)
  feeds: FeedModel[];

  @OneToMany(() => FeedLiker, (feedLiker) => feedLiker.user)
  feed_likers: FeedLikerModel[];
}
