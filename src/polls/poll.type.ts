import { ObjectType, Field, ID } from '@nestjs/graphql';
import { VoteOptionType } from './vote-option.type';

@ObjectType()
export class PollType {
  _id: string;

  @Field(() => ID)
  get id(): string {
    return this._id.toString();
  }

  @Field()
  question: string;

  @Field(() => [VoteOptionType])
  options: VoteOptionType[];
}
