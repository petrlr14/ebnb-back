import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from '../resources/resource.entity';
import { Room } from './room.entity';
import { CreateRoomInput, RoomFilterInput } from './room.input';
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
    const room = await this.roomRepository.findOne(id);
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async getRooms(roomFilterInput: RoomFilterInput) {
    return await this.roomRepository.getRooms(roomFilterInput);
  }

  async createRoom(createRoom: CreateRoomInput) {
    return await this.roomRepository.createRoom(createRoom);
  }
}
