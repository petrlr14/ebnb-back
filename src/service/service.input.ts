import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateServiceInput {
  @Field()
  name: string;
  @Field()
  displayName: string;
}
