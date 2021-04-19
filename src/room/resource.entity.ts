import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  url: string;
  @ManyToOne(() => Room, (room) => room.resources, { eager: false })
  @JoinColumn({ name: 'room_id' })
  room: Room;
}
