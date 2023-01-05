import { UpdateCoupleInfoModel } from '@domain/model/database/couple-info';
import { ICoupleChannelRepository } from '@domain/repositories/couple-channel.repository.interface';
import { ICoupleInfoRepository } from '@domain/repositories/couple-info.repository.interface';
import { EntityManager } from 'typeorm';

export class UpdateCoupleUseCases {
  constructor(
    private readonly coupleInfoRepository: ICoupleInfoRepository,
    private readonly coupleChannelRepository: ICoupleChannelRepository,
  ) {}

  async updateLoveday(
    coupleChannelId: number,
    date: Date,
    conn?: EntityManager,
  ): Promise<boolean> {
    const coupleChannel = await this.coupleChannelRepository.findById(
      coupleChannelId,
    );
    if (!coupleChannel.couple_info_id) {
      return false;
    }
    const updated = new UpdateCoupleInfoModel();
    updated.loveday = date;
    await this.coupleInfoRepository.update(
      coupleChannel.couple_info_id,
      updated,
      conn,
    );
    return true;
  }
}
