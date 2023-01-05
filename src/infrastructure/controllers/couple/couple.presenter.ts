import { AnniversaryModel } from '@domain/model/database/anniversary';
import { CoupleChannelModel } from '@domain/model/database/couple-channel';
import { CoupleInfoModel } from '@domain/model/database/couple-info';
import { ApiProperty } from '@nestjs/swagger';
import { SimpleUserPresenter } from '../user/user.presenter';

export class AnniversaryPresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  datetime: Date;

  constructor(data: AnniversaryModel) {
    this.id = data.id;
    this.name = data.name;
    this.datetime = data.datetime;
  }
}

export class CoupleInfoPresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  loveday: Date;

  @ApiProperty({ type: [AnniversaryPresenter] })
  anniversaries: AnniversaryPresenter[];

  constructor(data: CoupleInfoModel) {
    this.id = data.id;
    this.loveday = data.loveday;
    this.anniversaries = data.anniversaries.map(
      (i) => new AnniversaryPresenter(i),
    );
  }
}

export class CoupleChannelPresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty({ type: [SimpleUserPresenter] })
  users: SimpleUserPresenter[];

  @ApiProperty({ type: CoupleInfoPresenter, nullable: true })
  couple_info: CoupleInfoPresenter | null;

  constructor(data: CoupleChannelModel) {
    this.id = data.id;
    this.code = data.code;
    this.users = data.users
      ? data.users.map((i) => new SimpleUserPresenter(i))
      : [];
    this.couple_info = data.couple_info
      ? new CoupleInfoPresenter(data.couple_info)
      : null;
  }
}
