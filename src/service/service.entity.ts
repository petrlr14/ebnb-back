import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from '../room/room.entity';

@ObjectType()
@Entity()
export class Service {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column()
  @Index({ unique: true })
  name: string;
  @Field()
  @Column()
  displayName: string;
  @ManyToMany(() => Room, (room) => room.services)
  rooms: Room[];
}
