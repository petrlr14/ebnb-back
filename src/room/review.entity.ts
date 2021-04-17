import { Room } from 'src/room/room.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @ManyToOne(() => User, (user) => user.id, { primary: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @ManyToOne(() => Room, (room) => room.id, { primary: true, eager: true })
  @JoinColumn({ name: 'room_id' })
  room!: Room;
  @Column({ type: 'text' })
  review: string;
  @Column({ type: 'decimal' })
  rate: number;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
