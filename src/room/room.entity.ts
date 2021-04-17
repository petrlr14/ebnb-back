import { Reservation } from 'src/reservation/reservation.entity';
import { Resource } from 'src/room/resource.entity';
import { Review } from 'src/room/review.entity';
import { FavoritesRoom } from 'src/user/favoritesRooms.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
