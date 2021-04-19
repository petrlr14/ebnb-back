import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from '../resources/resource.entity';
import { Room } from './room.entity';
import { CreateRoomInput } from './room.input';
import { RoomRepository } from './room.repository';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomRepository)
    private readonly roomRepository: RoomRepository,
  ) {}

  async addResources(resouces: Resource[], room: Room) {
    return await this.roomRepository.addResources(resouces, room);
  }

  async getRoomById(id: number) {
    return await this.roomRepository.findOne(id);
  }

  async getRooms() {
    return await this.roomRepository.find();
  }

  async createRoom(createRoom: CreateRoomInput) {
    return await this.roomRepository.createRoom(createRoom);
  }
}
