import { IUserRepository } from '@domain/repositories/user.repository.interface';

export class GetUserUseCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUserByIdWithProfile(userId: number) {
    return await this.userRepository.findByIdUserWithProfile(userId);
  }
}
