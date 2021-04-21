import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { User } from './user.entity';
import { GResponse } from './user.gql.model';
import { CurrentUser, GqlAuthGuard } from './user.guard';
import { CreateUserInput, FindUserInput, LikeRoomInput } from './user.input';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => [User])
  async getUsers() {
    return this.userService.getAllUsers();
  }
  @Query(() => User)
  async getUser(@Args('getUserInput') getUserInput: FindUserInput) {
    return this.userService.getUser(getUserInput);
  }
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.userService.createUser(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(GqlAuthGuard)
  async toggleFavoritesRoom(
    @CurrentUser('user') user: User,
    @Args('likeRoomInput') likeRoomInput: LikeRoomInput,
  ) {
    return await this.userService.toggleFavoritesRoom(likeRoomInput, user);
  }

  @Mutation(() => GResponse)
  async sendVerification(@Args('getUserInput') getUserInput: FindUserInput) {
    await this.userService.sendVerification(getUserInput);
    return {
      data: 'An email was sent',
    };
  }

  @Mutation(() => GResponse)
  @UseGuards(GqlAuthGuard)
  async loginWithMagicLink(
    @CurrentUser('user') user: User,
    @Context('req') req: Request,
  ) {
    const token = await this.userService.verifyUser(
      user,
      req.headers.authorization.split(' ')[1],
    );
    return {
      data: token.token,
    };
  }
}
