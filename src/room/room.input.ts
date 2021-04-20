import { Field, InputType, PartialType } from '@nestjs/graphql';

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
export class RoomFilterInput extends PartialType(CreateRoomInput) {}
