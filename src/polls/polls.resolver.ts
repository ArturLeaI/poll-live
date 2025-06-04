import { Resolver, Query, Mutation, Args, ID, Subscription } from '@nestjs/graphql';
import { PollsService } from './polls.service';
import { PollType } from './poll.type';
import { CreatePollInput } from './poll.input';
import { AddVoteInput } from './vote.input';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => PollType)
export class PollsResolver {
    constructor(
        private readonly pollsService: PollsService,
        @Inject('PUB_SUB') private pubSub: PubSub,
    ) { }


    @Query(() => [PollType])
    getPolls() {
        return this.pollsService.findAll();
    }

    @Query(() => PollType)
    getPollById(@Args('id') id: string) {
        return this.pollsService.findById(id);
    }

    @Mutation(() => PollType)
    createPoll(@Args('data') data: CreatePollInput) {
        return this.pollsService.createPoll(data.question, data.options);
    }

    @Mutation(() => PollType)
    addVote(@Args('data') data: AddVoteInput) {
        return this.pollsService.vote(data.pollId, data.optionId);
    }

    @Mutation(() => Boolean)
    async deletePoll(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        return this.pollsService.deletePoll(id);
    }

    @Mutation(() => Boolean)
    async deleteAllPolls(): Promise<boolean> {
        return this.pollsService.deleteAllPolls();
    }

    @Subscription(() => PollType, { name: 'pollUpdated' })
pollUpdated() {
  return this.pubSub.asyncIterableIterator('pollUpdated');
}
}

