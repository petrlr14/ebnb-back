import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';
import { User } from './user.entity';

@ObjectType()
@Entity('fav_room')
@Index(['user', 'room'], { unique: true })
export class FavoritesRoom {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @ManyToOne(() => User, (user) => user.id, {
    primary: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Field()
  @ManyToOne(() => Room, (room) => room.id, {
    primary: true,
    eager: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'room_id' })
  room!: Room;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
