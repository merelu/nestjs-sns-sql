import { PickType } from '@nestjs/mapped-types';
import { FeedModel } from './feed';
import { UserModel } from './user';

export class FeedLikerModel {
  feed_id: number;
  feed: FeedModel;
  user_id: number;
  user: UserModel;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export class CreateFeedLikerModel extends PickType(FeedLikerModel, [
  'feed_id',
  'user_id',
] as const) {}
