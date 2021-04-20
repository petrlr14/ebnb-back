import { EntityRepository, Repository } from 'typeorm';
import { Resource } from '../resources/resource.entity';
import { Room } from './room.entity';
import { CreateRoomInput, RoomFilterInput } from './room.input';
@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  async createRoom(createRoom: CreateRoomInput) {
    const room = new Room();
    for (const x in createRoom) {
      room[x] = createRoom[x];
    }
    return await this.save(room);
  }
  async getRooms(roomFilterInput: RoomFilterInput): Promise<Room[]> {
    const query = this.createQueryBuilder('room');
    if (roomFilterInput.name) {
      console.log(roomFilterInput.name);
      query.andWhere('LOWER(room.name) LIKE :name', {
        name: `%${roomFilterInput.name.toLowerCase()}%`,
      });
    }
    if (roomFilterInput.building) {
      query.andWhere('LOWER(room.building) LIKE :building', {
        building: `%${roomFilterInput.building.toLowerCase()}%`,
      });
    }
    if (roomFilterInput.capacity) {
      query.andWhere('room.capacity BETWEEN :x1 AND :x2', {
        x1: roomFilterInput.capacity - 5,
        x2: roomFilterInput.capacity + 5,
      });
    }
    if (roomFilterInput.location) {
      query.andWhere('LOWER(room.location) LIKE :location', {
        location: `%${roomFilterInput.location.toLowerCase()}%`,
      });
    }
    const result = await query
      .leftJoinAndSelect('room.resources', 'resource')
      .getMany();
    return result;
  }

  async addResources(resouces: Resource[], room: Room) {
    room.resources = [...room.resources, ...resouces];
    return await this.save(room);
  }
}
