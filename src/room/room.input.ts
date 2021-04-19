import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';

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
export class RoomFilterInput extends PartialType(
  OmitType(CreateRoomInput, ['name']),
) {}
