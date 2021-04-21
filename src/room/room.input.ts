import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

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
}

@InputType()
class RoomFilterWithServiceId extends CreateRoomInput {
  @Field(() => [Int])
  serviceId: number[];
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
