import { IAwsS3Service } from '@domain/adapters/aws.s3.interface';
import { IMAGE_BASE_URL } from '@domain/common/constants/image.baseurl';
import { PresignedImageModel } from '@domain/model/common/presigned-image';

export class PresignedProfileImageUseCases {
  constructor(private readonly awsService: IAwsS3Service) {}

  async execute(userId: number): Promise<PresignedImageModel> {
    const path = `user/${userId}/profile`;
    const key = this.awsService.generateKey(path);
    const presignedUrl = await this.awsService.generatePutPresignedUrl(key);

    return new PresignedImageModel(
      presignedUrl,
      key,
      IMAGE_BASE_URL + `/${key}`,
    );
  }
}
