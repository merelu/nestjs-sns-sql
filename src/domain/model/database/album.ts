import { CoupleChannelModel } from './couple-channel';
import { FeedModel } from './feed';

export class AlbumModel {
  id: number;

  deleted_at: Date | null;

  created_at: Date;

  updated_at: Date;

  couple_channel: CoupleChannelModel;

  feeds: FeedModel[];
}
