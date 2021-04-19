import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';

@ObjectType()
@Entity()
export class Resource {
  @Field()
  @PrimaryGeneratedColumn()
  @Generated('uuid')
  id: string;
  @Field()
  @Column()
  url: string;
  @ManyToOne(() => Room, (room) => room.resources, { eager: false })
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
