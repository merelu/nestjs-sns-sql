import { IAwsS3Service } from '@domain/adapters/aws.s3.interface';
import { IMAGE_BASE_URL } from '@domain/common/constants/image.baseurl';
import { PresignedImageModel } from '@domain/model/common/presigned-image';

export class PresignedFeedImagesUseCases {
  constructor(private readonly awsService: IAwsS3Service) {}

  async execute(
    coupleChannelId: number,
    size: number,
  ): Promise<PresignedImageModel[]> {
    console.log('실행');
    const arr: string[] = new Array(size).fill('');
    console.log(size, arr);

    return await Promise.all(
      arr.map(async () => {
        const path = `couple/${coupleChannelId}/album`;
        const key = this.awsService.generateKey(path);
        const presignedUrl = await this.awsService.generatePutPresignedUrl(key);

        return new PresignedImageModel(
          presignedUrl,
          key,
          IMAGE_BASE_URL + `/${key}`,
        );
      }),
    ).catch((err) => {
      console.log(err);
      throw err;
    });
  }
}
