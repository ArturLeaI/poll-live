import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreatePollInput {
  @Field()
  question: string;

  @Field(() => [String])
  options: string[];
}
