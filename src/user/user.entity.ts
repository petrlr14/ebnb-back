import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../reservation/reservation.entity';
import { FavoritesRoom } from './favoritesRooms.entity';
@ObjectType()
@Entity('user')
export class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @Column()
  @Generated('uuid')
  code: string;
  @Field()
  @Column()
  @Index({ unique: true })
  email: string;
  @Column({ nullable: true })
  lastVerificationId: string;
  @Field(() => [Reservation])
  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservations: Reservation[];
  @Field(() => [FavoritesRoom])
  @OneToMany(() => FavoritesRoom, (favRooms) => favRooms.user, {
    cascade: ['insert'],
  })
  favRooms: FavoritesRoom[];
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
