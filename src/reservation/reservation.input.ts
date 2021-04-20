import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReservationInput {
  @Field()
  roomId: number;
  @Field()
  startDate: Date;
  @Field()
  endDate: Date;
  @Field()
  startTime: string;
  @Field()
  endTime: string;
}
