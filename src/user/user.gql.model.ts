import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GResponse {
  @Field()
  data: string;
}
