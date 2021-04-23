import { UnprocessableEntityException } from '@nestjs/common';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';
import { Resource } from '../resources/resource.entity';
import { Service } from '../service/service.entity';
import { User } from '../user/user.entity';
import { Room } from './room.entity';
import { CreateRoomInput, RoomFilterInput } from './room.input';
@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  async createRoom(createRoom: CreateRoomInput) {
    const room = new Room();
    if (createRoom.openingTime >= createRoom.closingTime) {
      throw new UnprocessableEntityException({
        message: 'Opening time is after Closing time',
      });
    }
    for (const x in createRoom) {
      room[x] = createRoom[x];
    }
    return await this.save(room);
  }

  async getRooms(
    roomFilterInput: RoomFilterInput,
    user?: User,
  ): Promise<Room[]> {
    const query = this.createQueryBuilder('room');
    const subQuery = this.createQueryBuilder('room')
      .select(
        '(favRoom.user_id is not null AND favRoom.user_id = :userId)',
        'isFav',
      )
      .addSelect('room.id', 'id')
      .setParameters({ userId: user.id })
      .leftJoin('room.favRoom', 'favRoom', '"favRoom"."room_id"="room"."id"');
    if (roomFilterInput.search) {
      const searchTerm = roomFilterInput.search.toLowerCase();
      query
        .orWhere('LOWER(room.name) LIKE :term', {
          term: `%${searchTerm}%`,
        })
        .orWhere('LOWER(room.building) LIKE :term', {
          term: `%${searchTerm}%`,
        })
        .orWhere('LOWER(room.location) LIKE :term', {
          term: `%${searchTerm}%`,
        });
      subQuery
        .orWhere('LOWER(room.name) LIKE :term', {
          term: `%${searchTerm}%`,
        })
        .orWhere('LOWER(room.building) LIKE :term', {
          term: `%${searchTerm}%`,
        })
        .orWhere('LOWER(room.location) LIKE :term', {
          term: `%${searchTerm}%`,
        });
    } else {
      if (roomFilterInput.name) {
        query.andWhere('LOWER(room.name) LIKE :name', {
          name: `%${roomFilterInput.name.toLowerCase()}%`,
        });
        subQuery.andWhere('LOWER(room.name) LIKE :name', {
          name: `%${roomFilterInput.name.toLowerCase()}%`,
        });
      }
      if (roomFilterInput.building) {
        query.andWhere('LOWER(room.building) LIKE :building', {
          building: `%${roomFilterInput.building.toLowerCase()}%`,
        });
        subQuery.andWhere('LOWER(room.building) LIKE :building', {
          building: `%${roomFilterInput.building.toLowerCase()}%`,
        });
      }
      if (roomFilterInput.location) {
        query.andWhere('LOWER(room.location) LIKE :location', {
          location: `%${roomFilterInput.location.toLowerCase()}%`,
        });
        subQuery.andWhere('LOWER(room.location) LIKE :location', {
          location: `%${roomFilterInput.location.toLowerCase()}%`,
        });
      }
    }
    if (roomFilterInput.serviceId) {
      const sbArgs: [x: any, y: any, z: any] = [
        (sb: SelectQueryBuilder<any>) => {
          return sb
            .select('room.id', 'id')
            .from(Room, 'room')
            .innerJoin('room.services', 'services')
            .where('services.id IN (:...ids)', {
              ids: roomFilterInput.serviceId,
            });
        },
        'filteredServices',
        'room.id = "filteredServices".id',
      ];
      // gets all the rooms that has the requested service
      query.innerJoin(...sbArgs);
      subQuery.innerJoin(...sbArgs);
    }
    if (roomFilterInput.capacity) {
      query.andWhere('room.capacity BETWEEN :x1 AND :x2', {
        x1: roomFilterInput.capacity - 5,
        x2: roomFilterInput.capacity + 5,
      });
      subQuery.andWhere('room.capacity BETWEEN :x1 AND :x2', {
        x1: roomFilterInput.capacity - 5,
        x2: roomFilterInput.capacity + 5,
      });
    }

    query
      .leftJoinAndSelect('room.resources', 'resource')
      .orderBy('resource.id', 'DESC')
      .leftJoinAndSelect('room.services', 'services')
      .orderBy('services.id', 'DESC');
    let roomsLikedByUser: { isFav: boolean }[];

    if (user) {
      roomsLikedByUser = await subQuery.orderBy('id', 'ASC').getRawMany();
    }
    const result = await query.orderBy('room.id', 'ASC').getMany();
    if (roomFilterInput.openingTime && roomFilterInput.closingTime) {
      return result.filter(
        ({ openingTime, closingTime }) =>
          openingTime <= roomFilterInput.openingTime &&
          closingTime >= roomFilterInput.closingTime,
      );
    }
    return result.map((room, index) => {
      if (user) room.isFav = roomsLikedByUser[index].isFav;
      else room.isFav = null;
      console.log(room.services);
      return room;
    });
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
