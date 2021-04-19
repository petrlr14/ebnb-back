import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserInput, FindUser } from './user.input';
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
  async getUser(verifyUser: FindUser): Promise<User> {
    if (verifyUser.email)
      return await this.findOne({ where: { email: verifyUser.email } });
    if (verifyUser.code)
      return await this.findOne({ where: { code: verifyUser.code } });
    return null;
  }
  async addVerificationId(user: User, token: string): Promise<User> {
    user.lastVerificationId = token;
    await this.save(user);
    return user;
  }
  async removeVerificationId(user: User): Promise<User> {
    user.lastVerificationId = null;
    await this.save(user);
    return user;
  }
}
