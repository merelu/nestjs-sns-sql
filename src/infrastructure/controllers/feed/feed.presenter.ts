import { AccessTypeEnum } from '@domain/common/enums/access-type.enum';
import { FeedModel } from '@domain/model/database/feed';
import { ApiProperty } from '@nestjs/swagger';
import { SimpleUserPresenter } from '../user/user.presenter';

export class BaseFeedPresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  access_type: AccessTypeEnum;

  @ApiProperty()
  content: string;

  @ApiProperty()
  dating_date: Date;

  @ApiProperty()
  like_count: number;

  @ApiProperty()
  is_liked: boolean;

  constructor(data: FeedModel) {
    this.id = data.id;
    this.access_type = data.access_type;
    this.content = data.content;
    this.dating_date = data.dating_date;
    this.like_count = data.like_count;
    this.is_liked = data.is_liked;
  }
}

export class FeedDetailPresenter extends BaseFeedPresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  access_type: AccessTypeEnum;

  @ApiProperty()
  content: string;

  @ApiProperty()
  dating_date: Date;

  @ApiProperty()
  photos: string[];

  @ApiProperty({ type: SimpleUserPresenter })
  writer: SimpleUserPresenter;

  constructor(data: FeedModel) {
    super(data);
    this.photos = data.photos.map((i) => (i.url ? i.url : ''));
    this.writer = new SimpleUserPresenter(data.writer);
  }
}
