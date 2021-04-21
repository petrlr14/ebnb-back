import { User } from './user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserInput, FindUserInput, LikeRoomInput } from './user.input';
import errorHandler from '../utils/errorHandler';
import { Room } from '../room/room.entity';
import { FavoritesRoom } from './favoritesRooms.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(userDTO: CreateUserInput): Promise<User> {
    const user = new User();
    user.email = userDTO.email;
    user.favRooms = [];
    try {
      return await this.save(user);
    } catch (e) {
      errorHandler(e, User.name);
    }
  }
  async getUser(verifyUser: FindUserInput): Promise<User> {
    if (verifyUser.email)
      return await this.findOne({
        where: { email: verifyUser.email },
        relations: ['favRooms', 'reservations'],
      });
    if (verifyUser.code)
      return await this.findOne({
        where: { code: verifyUser.code },
        relations: ['favRooms', 'reservations'],
      });
    return null;
  }
  async addVerificationId(user: User, token: string): Promise<User> {
    user.lastVerificationId = token;
    await this.save(user);
    return user;
  }
  async removeVerificationId(user: User): Promise<User> {
    user.lastVerificationId = null;
    await this.save(user);
    return user;
  }
  async toggleFavoritesRoom(
    likeInput: LikeRoomInput,
    user: User,
  ): Promise<User> {
    let userFavs = user.favRooms.filter(
      ({ room: { id } }) => id !== likeInput.roomId,
    );
    if (userFavs.length !== user.favRooms.length) {
      user.favRooms = userFavs;
    } else {
      const room = new Room();
      room.id = likeInput.roomId;
      const favRoom = new FavoritesRoom();
      favRoom.room = room;
      favRoom.user = user;
      userFavs = [...userFavs, favRoom];
    }

    try {
      user.favRooms = [...userFavs];
      return await this.save(user);
    } catch (e) {
      throw e;
    }
  }
}
