export class PresignedImageModel {
  presigned_url: string;

  key: string;

  url: string;

  constructor(presignedUrl: string, key: string, url: string) {
    this.presigned_url = presignedUrl;
    this.key = key;
    this.url = url;
  }
}
