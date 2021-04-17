import { Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => User)
  async getUser() {
    return null;
  }
}
