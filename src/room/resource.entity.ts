import { Room } from 'src/room/room.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
