import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Room } from './room.entity';
import { CreateRoomInput } from './room.input';
import { RoomService } from './room.service';

@Resolver(() => Room)
export class RoomResolver {
  constructor(private readonly roomService: RoomService) {}

  @Query(() => [Room])
  async getRooms() {
    return await this.roomService.getRooms();
  }

  @Mutation(() => Room)
  async createRoom(@Args('createRoomInput') createRoomInput: CreateRoomInput) {
    return this.roomService.createRoom(createRoomInput);
  }
}
