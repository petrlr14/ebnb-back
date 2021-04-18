import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './user.input';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(userDTO: CreateUserInput): Promise<User> {
    return await this.userRepository.createUser(userDTO);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({});
  }
}
