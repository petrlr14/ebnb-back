import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from '../resources/resource.entity';
import { User } from '../user/user.entity';
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

  async getRoomById(id: number, options: { [key: string]: any } = {}) {
    const room = await this.roomRepository.findOne(id, { ...options });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async getRooms(roomFilterInput: RoomFilterInput, user?: User) {
    return await this.roomRepository.getRooms(roomFilterInput, user);
  }

  async createRoom(createRoom: CreateRoomInput) {
    return await this.roomRepository.createRoom(createRoom);
  }

  async addServices(servicesIds: number[], roomId: number): Promise<Room> {
    const room = await this.getRoomById(roomId, { relations: ['services'] });
    const result = await this.roomRepository.addServices(servicesIds, room);
    if (result[1].length > 0) {
      throw new ConflictException({
        message: `${result[1].length} services are conflict`,
        conflicServices: result[1],
        successServices: result[0],
      });
    }
    return result[0][0];
  }
}
