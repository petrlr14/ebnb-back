import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../reservation/reservation.entity';
import { FavoritesRoom } from '../user/favoritesRooms.entity';
import { Resource } from './resource.entity';
import { Review } from './review.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  location: string;
  @Column()
  building: string;
  @Column({ default: 0.0 })
  rate: number;
  @Column({ type: 'integer' })
  capacity: number;
  @OneToMany(() => Resource, (resource) => resource.room, { eager: true })
  resources: Resource;
  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];
  @OneToMany(() => Review, (review) => review.room)
  reviews: Review[];
  @OneToMany(() => FavoritesRoom, (favRoom) => favRoom.user)
  favRoom: FavoritesRoom[];
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
