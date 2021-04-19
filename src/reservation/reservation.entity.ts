import { Field, ObjectType } from '@nestjs/graphql';
import { Room } from '../room/room.entity';
import { User } from '../user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Reservation {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.id, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @ManyToOne(() => Room, (room) => room.id, { eager: true })
  @JoinColumn({ name: 'room_id' })
  room!: Room;
  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;
  @Column({ type: 'timestamp', name: 'end_date' })
  endDate: Date;
  @Column({ type: 'timestamptz', name: 'start_time' })
  startTime: Date;
  @Column({ type: 'timestamptz', name: 'end_time' })
  endTime: Date;
}
