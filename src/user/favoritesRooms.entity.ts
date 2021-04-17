import { Room } from 'src/room/room.entity';
import { User } from 'src/user/user.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity('fav_room')
export class FavoritesRoom {
  @ManyToOne(() => User, (user) => user.id, { primary: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @ManyToOne(() => Room, (room) => room.id, { primary: true, eager: true })
  @JoinColumn({ name: 'room_id' })
  room!: Room;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
