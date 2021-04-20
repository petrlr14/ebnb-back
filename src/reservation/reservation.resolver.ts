import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoomService } from '../room/room.service';
import { User } from '../user/user.entity';
import { CurrentUser, GqlAuthGuard } from '../user/user.guard';
import { Reservation } from './reservation.entity';
import { CreateReservationInput } from './reservation.input';
import { ReservationService } from './reservation.service';

@Resolver(() => Reservation)
export class ReservationResolver {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly roomService: RoomService,
  ) {}

  @Query(() => [Reservation])
  async getReservations(@Args('roomId') roomId: number) {
    const room = await this.roomService.getRoomById(roomId);
    return await this.reservationService.getReservationsByRoomId(room.id);
  }

  @Mutation(() => Reservation)
  @UseGuards(GqlAuthGuard)
  async createReservation(
    @CurrentUser('user') user: User,
    @Args('createReservationInput')
    createReservationInput: CreateReservationInput,
  ): Promise<Reservation> {
    const room = await this.roomService.getRoomById(
      createReservationInput.roomId,
    );
    return await this.reservationService.createReservation(
      user,
      room,
      createReservationInput,
    );
  }
}
