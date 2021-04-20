import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Room } from '../room/room.entity';
import { User } from '../user/user.entity';
import { Reservation } from './reservation.entity';
import { CreateReservationInput } from './reservation.input';
import { ISOToDBDate } from '../utils/dateFormat';

@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {
  async createReservation(
    user: User,
    room: Room,
    createInput: CreateReservationInput,
  ) {
    const fixedStartDate = new Date(createInput.startDate.setHours(0, 0, 0, 0));
    const fixedEndDate = new Date(createInput.endDate.setHours(0, 0, 0, 0));
    const reservation = new Reservation();
    reservation.user = user;
    reservation.room = room;
    reservation.startDate = fixedStartDate;
    reservation.endDate = fixedEndDate;
    reservation.startTime = createInput.startTime;
    reservation.endTime = createInput.endTime;
    return await this.save(reservation);
  }

  async getReservationsByRoomId(roomId: number): Promise<Reservation[]> {
    return await this.createQueryBuilder('reservation')
      .where('reservation.room_id = :roomId', { roomId })
      .getMany();
  }

  async lookForOverlap(createInput: CreateReservationInput): Promise<void> {
    const fixedStartDate = new Date(createInput.startDate.setHours(0, 0, 0, 0));
    const fixedEndDate = new Date(createInput.endDate.setHours(0, 0, 0, 0));
    const formattedStartDate = ISOToDBDate(fixedStartDate.toISOString());
    const formattedEndDate = ISOToDBDate(fixedEndDate.toISOString());
    const conflictReservations = await this.createQueryBuilder('reservation')
      .where('reservation.room_id = :id', { id: createInput.roomId })
      .andWhere(
        'reservation.start_date >= :startDate AND reservation.start_date <= :endDate',
        {
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        },
      )
      .orWhere('reservation.end_date BETWEEN :startDate AND :endDate', {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
      .getMany();
    const conflicHourReservation = conflictReservations.filter(
      ({ startTime, endTime }) => {
        if (
          startTime >= createInput.startTime &&
          startTime <= createInput.endTime
        ) {
          return true;
        }
        if (
          endTime >= createInput.startTime &&
          endTime <= createInput.endTime
        ) {
          return true;
        }
        return false;
      },
    );
    if (conflicHourReservation.length > 0) {
      throw new ConflictException(
        'One or more dates overlap with other reservation',
      );
    }
  }
}
