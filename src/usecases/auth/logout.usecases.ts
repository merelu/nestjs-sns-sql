import { IRedisCacheService } from '@domain/adapters/redis-cache.interface';

export class LogoutUseCases {
  constructor(private readonly redisCashService: IRedisCacheService) {}

  async execute(userId: number): Promise<string[]> {
    await this.redisCashService.del('refresh' + userId);

    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
