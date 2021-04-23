import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { User } from '../user/user.entity';
import { CurrentUser, GqlOptionalAuthGuard } from '../user/user.guard';
import { Room } from './room.entity';
import {
  AddServiceInput,
  CreateRoomInput,
  RoomFilterInput,
} from './room.input';
import { RoomService } from './room.service';

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Query(() => Room)
  async getRoomById(@Args('id', { type: () => Int }) id: number) {
    return await this.roomService.getRoomById(id, { relations: ['services'] });
  }

  @Query(() => [Room])
  @UseGuards(GqlOptionalAuthGuard)
  async getRooms(
    @Args('roomFilterInput') roomFilterInput: RoomFilterInput,
    @CurrentUser('user') user: User,
  ) {
    return await this.roomService.getRooms(roomFilterInput, user);
  }

  @Mutation(() => Room)
  async createRoom(@Args('createRoomInput') createRoomInput: CreateRoomInput) {
    return this.roomService.createRoom(createRoomInput);
  }

  @Mutation(() => Room)
  async addServices(
    @Args('servicesIds')
    addServicesInput: AddServiceInput,
  ) {
    return await this.roomService.addServices(
      addServicesInput.ids,
      addServicesInput.roomId,
    );
  }
}
