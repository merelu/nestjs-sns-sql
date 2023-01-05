import { CreateFeedLikerModel } from '@domain/model/database/feed-liker';

export interface IFeedLikerRepository {
  //like
  create(data: CreateFeedLikerModel): Promise<boolean>;

  //unlike
  delete(feedId: number, userId: number): Promise<boolean>;
}
