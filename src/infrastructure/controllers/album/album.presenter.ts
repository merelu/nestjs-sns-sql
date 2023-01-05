import { AlbumModel } from '@domain/model/database/album';
import { ApiProperty } from '@nestjs/swagger';
import { BaseFeedPresenter } from '../feed/feed.presenter';

export class AlbumPresenter {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: [BaseFeedPresenter] })
  feeds: BaseFeedPresenter[];

  constructor(data: AlbumModel) {
    this.id = data.id;
    this.feeds = data.feeds.map((i) => new BaseFeedPresenter(i));
  }
}
