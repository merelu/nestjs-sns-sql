import { CoupleChannelModel } from '@domain/model/database/couple-channel';
import { ICoupleChannelRepository } from '@domain/repositories/couple-channel.repository.interface';

export class GetCoupleUseCases {
  constructor(
    private readonly coupleChannelRepository: ICoupleChannelRepository,
  ) {}

  async getCoupleByCoupleChannelId(
    coupleChannelId: number,
  ): Promise<CoupleChannelModel | null> {
    const result = await this.coupleChannelRepository.findByIdWithCoupleInfo(
      coupleChannelId,
    );

    return result;
  }
}
