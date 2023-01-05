import { UpdateFeedModel } from '@domain/model/database/feed';
import { IFeedRepository } from '@domain/repositories/feed.repository.interface';
import { UpdateFeedDto } from '@infrastructure/controllers/feed/feed.dto';

export class UpdateFeedUseCases {
  constructor(private readonly feedRepository: IFeedRepository) {}

  async updateFeed(feedId: number, data: UpdateFeedDto) {
    const updateModel = new UpdateFeedModel();
    updateModel.access_type = data.access_type;
    updateModel.content = data.content;
    updateModel.dating_date = data.dating_date;

    const result = await this.feedRepository.update(feedId, updateModel);
    console.log(result);
  }

  async checkFeed(feedId: number) {
    return await this.feedRepository.findFeedById(feedId);
  }
}
