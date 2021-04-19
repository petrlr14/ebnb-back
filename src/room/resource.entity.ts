import {
  Column,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  @Generated('uuid')
  id: string;
  @Column()
  url: string;
  @ManyToOne(() => Room, (room) => room.resources, { eager: false })
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
