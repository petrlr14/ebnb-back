import { Field, InputType } from '@nestjs/graphql';
import { Matches } from 'class-validator';
import { timeFormatPattern } from '../utils/dateFormat';

@InputType()
export class CreateReservationInput {
  @Field()
  roomId: number;
  @Field()
  startDate: Date;
  @Field()
  endDate: Date;
  @Field()
  @Matches(...timeFormatPattern)
  startTime: string;
  @Field()
  @Matches(...timeFormatPattern)
  endTime: string;
}
