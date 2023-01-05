import { IUserRepository } from '@domain/repositories/user.repository.interface';

export class DeleteUserUseCases {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
