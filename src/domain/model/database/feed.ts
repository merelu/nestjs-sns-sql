import { AccessTypeEnum } from '@domain/common/enums/access-type.enum';
import { PickType } from '@nestjs/mapped-types';
import { AlbumModel } from './album';
import { FeedLikerModel } from './feed-liker';
import { PhotoModel } from './photo';
import { UserModel } from './user';

export class FeedModel {
  id: number;
  access_type: AccessTypeEnum;
  content: string;
  dating_date: Date;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  photos: PhotoModel[];

  likers: UserModel[];
  feed_likers: FeedLikerModel[];

  writer_id: number | null;
  writer: UserModel;

  album_id: number | null;
  album: AlbumModel;

  like_count: number;
  is_liked: boolean;
}

export class CreateFeedModel extends PickType(FeedModel, [
  'access_type',
  'content',
  'dating_date',
  'album_id',
  'writer_id',
] as const) {}

export class UpdateFeedModel extends PickType(FeedModel, [
  'access_type',
  'content',
  'dating_date',
  'like_count',
] as const) {}
