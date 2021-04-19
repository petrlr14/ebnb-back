import { EntityRepository, Repository } from 'typeorm';
import { Resource } from '../resources/resource.entity';
import { Room } from './room.entity';
import { CreateRoomInput } from './room.input';
@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  async createRoom(createRoom: CreateRoomInput) {
    const room = new Room();
    for (const x in createRoom) {
      room[x] = createRoom[x];
    }
    return await this.save(room);
  }
  async getRooms() {
    return this.find({});
  }

  async addResources(resouces: Resource[], room: Room) {
    room.resources = [...room.resources, ...resouces];
    return await this.save(room);
  }
}
