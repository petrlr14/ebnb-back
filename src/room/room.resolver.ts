import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
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

  @Query(() => [Room])
  async getRooms(@Args('roomFilterInput') roomFilterInput: RoomFilterInput) {
    return await this.roomService.getRooms(roomFilterInput);
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
