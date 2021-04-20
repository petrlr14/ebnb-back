import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../room/room.entity';
import { User } from '../user/user.entity';
import { Reservation } from './reservation.entity';
import { CreateReservationInput } from './reservation.input';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async getReservationsByRoomId(roomId: number): Promise<Reservation[]> {
    return await this.reservationRepository.getReservationsByRoomId(roomId);
  }

  async createReservation(
    user: User,
    room: Room,
    reservationDTO: CreateReservationInput,
  ) {
    await this.reservationRepository.lookForOverlap(reservationDTO);
    return await this.reservationRepository.createReservation(
      user,
      room,
      reservationDTO,
    );
  }
}
