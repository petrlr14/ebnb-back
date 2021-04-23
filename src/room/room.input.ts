import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { Matches } from 'class-validator';
import { timeFormatPattern } from '../utils/dateFormat';

@InputType()
export class CreateRoomInput {
  @Field()
  name: string;
  @Field()
  location: string;
  @Field()
  building: string;
  @Field()
  capacity: number;
  @Field()
  @Matches(...timeFormatPattern)
  openingTime: string;
  @Field()
  @Matches(...timeFormatPattern)
  closingTime: string;
  @Field()
  description: string;
}

@InputType()
class RoomFilterWithServiceId extends CreateRoomInput {
  @Field(() => [Int])
  serviceId: number[];
  @Field()
  search: string;
  @Field(() => Int)
  limit: number;
}
@InputType()
export class RoomFilterInput extends PartialType(RoomFilterWithServiceId) {}

@InputType()
export class AddServiceInput {
  @Field(() => [Int])
  ids: number[];
  @Field()
  roomId: number;
}
