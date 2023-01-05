import { PresignedImageModel } from '@domain/model/common/presigned-image';
import { ApiProperty } from '@nestjs/swagger';

export class PresignedPresenter {
  @ApiProperty()
  presigned_url: string;

  @ApiProperty()
  key: string;

  @ApiProperty()
  url: string;

  constructor(data: PresignedImageModel) {
    this.presigned_url = data.presigned_url;
    this.key = data.key;
    this.url = data.url;
  }
}
