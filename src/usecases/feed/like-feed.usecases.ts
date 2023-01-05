import { CreateFeedLikerModel } from '@domain/model/database/feed-liker';
import { IFeedLikerRepository } from '@domain/repositories/feed-liker.repository.interface';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';

export class LikeFeedUseCases {
  constructor(
    private readonly feedLikerRepository: IFeedLikerRepository,
    private readonly feedRepository: IFeedRepository,
  ) {}

  async likeFeed(feedId: number, userId: number): Promise<void> {
    const newFeedLiker = new CreateFeedLikerModel();
    newFeedLiker.feed_id = feedId;
    newFeedLiker.user_id = userId;

    const result = await this.feedLikerRepository.create(newFeedLiker);

    if (result) {
      await this.feedRepository.increaseLikeCount(feedId);
    }
  }

  async unlike(feedId: number, userId: number): Promise<void> {
    const result = await this.feedLikerRepository.delete(feedId, userId);

    if (result) {
      await this.feedRepository.decreaseLikeCount(feedId);
    }
  }
}
