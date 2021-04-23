import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from '../reservation/reservation.entity';
import { FavoritesRoom } from '../user/favoritesRooms.entity';
import { Resource } from '../resources/resource.entity';
import { Review } from './review.entity';
import { Service } from '../service/service.entity';

@Entity()
@ObjectType()
export class Room {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Field()
  name: string;

  @Field()
  @Column()
  location: string;

  @Field()
  @Column()
  building: string;

  @Field()
  @Column({ default: 0.0 })
  rate: number;

  @Field()
  @Column({ type: 'integer' })
  capacity: number;

  @Field(() => [Resource])
  @OneToMany(() => Resource, (resource) => resource.room, {
    eager: true,
    cascade: ['insert'],
  })
  resources: Resource[];

  @OneToMany(() => Reservation, (reservation) => reservation.room)
  reservations: Reservation[];

  @Field(() => [Review])
  @OneToMany(() => Review, (review) => review.room)
  reviews: Review[];

  @OneToMany(() => FavoritesRoom, (favRoom) => favRoom.room)
  favRoom: FavoritesRoom[];

  @Field(() => [Service])
  @ManyToMany(() => Service, (service) => service.rooms)
  @JoinTable({
    name: 'room_services',
  })
  services: Service[];

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field()
  @Column({ name: 'opening_time' })
  openingTime: string;

  @Field()
  @Column({ name: 'closing_time' })
  closingTime: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field({ nullable: true })
  isFav: boolean;
}
