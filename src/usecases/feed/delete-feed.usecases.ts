import { IFeedRepository } from '@domain/repositories/feed.repository.interface';

export class DeleteFeedUseCases {
  constructor(private readonly feedRepository: IFeedRepository) {}

  async execute(feedId: number) {
    await this.feedRepository.delete(feedId);
  }

  async checkFeed(feedId: number) {
    return await this.feedRepository.findFeedById(feedId);
  }
}
