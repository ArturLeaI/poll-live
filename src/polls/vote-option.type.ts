import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class VoteOptionType {
  _id: string;

  @Field(() => ID)
  get id(): string {
    return this._id.toString();
  }

  @Field()
  text: string;

  @Field()
  votes: number;
}
