import { TypeOrmConfigModule } from '@infrastructure/config/typeorm/typeorm.module';
import { Album } from '@infrastructure/entities/album.entity';
import { Anniversary } from '@infrastructure/entities/anniversary.entity';
import { CoupleChannel } from '@infrastructure/entities/couple-channel.entity';
import { CoupleInfo } from '@infrastructure/entities/couple-info.entity';
import { Device } from '@infrastructure/entities/device.entity';
import { Message } from '@infrastructure/entities/message.entity';
import { ProfileImage } from '@infrastructure/entities/profile-image.entity';
import { Profile } from '@infrastructure/entities/profile.entity';
import { User } from '@infrastructure/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseCoupleChannelRepository } from './couple-channel.repository';
import { DatabaseCoupleInfoRepository } from './couple-info.repository';
import { DatabaseDeviceRepository } from './device.repository';
import { DatabaseProfileRepository } from './profile.repository';
import { DatabaseUserRepository } from './user.repository';
import { DatabaseProfileImageRepository } from './profile-image.repository';
import { DatabaseAlbumRepository } from './album.repository';
import { DatabaseAnniversaryRepository } from './anniversary.repository';
import { Photo } from '@infrastructure/entities/photo.entity';
import { DatabaseFeedRepository } from './feed.repository';
import { DatabasePhotoRepository } from './photo.repository';
import { Feed } from '@infrastructure/entities/feed.entity';
import { FeedLiker } from '@infrastructure/entities/feed-likers.entity';
import { DatabaseFeedLikerRepository } from './feed-liker.repository';
import { DatabaseMessageRepository } from './message.repository';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      User,
      Device,
      Profile,
      ProfileImage,
      CoupleChannel,
      CoupleInfo,
      Anniversary,
      Album,
      Message,
      Feed,
      Photo,
      FeedLiker,
    ]),
  ],
  providers: [
    DatabaseUserRepository,
    DatabaseDeviceRepository,
    DatabaseProfileRepository,
    DatabaseProfileImageRepository,
    DatabaseCoupleChannelRepository,
    DatabaseCoupleInfoRepository,
    DatabaseAlbumRepository,
    DatabaseAnniversaryRepository,
    DatabaseFeedRepository,
    DatabasePhotoRepository,
    DatabaseFeedLikerRepository,
    DatabaseMessageRepository,
  ],
  exports: [
    DatabaseUserRepository,
    DatabaseDeviceRepository,
    DatabaseProfileRepository,
    DatabaseProfileImageRepository,
    DatabaseCoupleChannelRepository,
    DatabaseCoupleInfoRepository,
    DatabaseAlbumRepository,
    DatabaseAnniversaryRepository,
    DatabaseFeedRepository,
    DatabasePhotoRepository,
    DatabaseFeedLikerRepository,
    DatabaseMessageRepository,
  ],
})
export class RepositoriesModule {}
