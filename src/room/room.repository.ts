import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Resource } from '../resources/resource.entity';
import { Service } from '../service/service.entity';
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
    if (roomFilterInput.serviceId) {
      // gets all the rooms that has the requested service
      query.innerJoinAndSelect(
        (sb: SelectQueryBuilder<any>) => {
          return sb
            .select('room.id', 'id')
            .from(Room, 'room')
            .innerJoin('room.services', 'services')
            .where('services.id IN (:...ids)', {
              ids: roomFilterInput.serviceId,
            });
        },
        'servicesx',
        'room.id = servicesx.id',
      );
    }
    const result = await query
      .leftJoinAndSelect('room.resources', 'resource')
      .leftJoinAndSelect('room.services', 'services')
      .getMany();
    return result;
  }

  async addResources(resouces: Resource[], room: Room) {
    room.resources = [...room.resources, ...resouces];
    return await this.save(room);
  }

  async addServices(
    servicesIds: number[],
    room: Room,
  ): Promise<[x1: Room[], x2: any[]]> {
    const error = [];
    await Promise.all(
      servicesIds.map(async (id) => {
        const service = new Service();
        service.id = id;
        try {
          await this.createQueryBuilder('room')
            .relation(Room, 'services')
            .of(room)
            .add(service);
        } catch (e) {
          console.log(e);
          error.push(id);
        }
      }),
    );
    return [[room], error];
  }
}
