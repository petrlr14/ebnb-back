import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserInput } from './user.input';
import errorHandler from '../utils/errorHandler';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userDTO: CreateUserInput): Promise<User> {
    const user = new User();
    user.email = userDTO.email;
    try {
      return await this.save(user);
    } catch (e) {
      errorHandler(e, User.name);
    }
  }
}
