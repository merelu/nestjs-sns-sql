import { PickType } from '@nestjs/mapped-types';
import { FeedModel } from './feed';

export class PhotoModel {
  id: number;
  key: string | null;
  url: string | null;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  feed_id: number | null;

  feed: FeedModel;
}

export class CreatePhotoModel extends PickType(PhotoModel, [
  'key',
  'url',
  'feed_id',
] as const) {}
