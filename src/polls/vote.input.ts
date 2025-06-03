import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class AddVoteInput {
  @Field(() => ID)
  pollId: string;

  @Field(() => ID)
  optionId: string;
}
