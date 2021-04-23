import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Room } from './room.entity';

@ObjectType()
@Entity()
export class Review {
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, { primary: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;
  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.id, { primary: true, eager: true })
  @JoinColumn({ name: 'room_id' })
  room!: Room;
  @Field()
  @Column({ type: 'text' })
  review: string;
  @Field()
  @Column({ type: 'decimal' })
  rate: number;
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
