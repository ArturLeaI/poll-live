import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Poll, PollDocument } from './poll.schema';
import { VoteOption, VoteOptionDocument } from './vote-option.schema';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PollsService {
  constructor(
    @InjectModel(Poll.name) private pollModel: Model<PollDocument>,
    @InjectModel(VoteOption.name) private optionModel: Model<VoteOptionDocument>,
    @Inject('PUB_SUB') private pubSub: PubSub,
  ) { }

  async createPoll(question: string, options: string[]): Promise<Poll> {
    const createdOptions = await this.optionModel.insertMany(
      options.map(text => ({ text }))
    );

    const poll = new this.pollModel({
      question,
      options: createdOptions.map(opt => opt._id),
    });

    const savedPoll = await poll.save();

    const populatedPoll = await this.pollModel.findById(savedPoll._id).populate('options').exec();

    if (!populatedPoll) {
      throw new NotFoundException('Poll not found after creation');
    }

    return populatedPoll;
  }

  async deletePoll(id: string): Promise<boolean> {
    const result = await this.pollModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async deleteAllPolls(): Promise<boolean> {
    const result = await this.pollModel.deleteMany({});
    return result.acknowledged === true;
  }

  async findAll(): Promise<Poll[]> {
    return this.pollModel.find().populate('options').exec();
  }

  async findById(id: string): Promise<Poll> {
    const poll = await this.pollModel.findById(id).populate('options').exec();
    if (!poll) throw new NotFoundException('Poll not found');
    return poll;
  }

  async vote(pollId: string, optionId: string): Promise<Poll> {
    const option = await this.optionModel.findById(optionId);
    if (!option) throw new NotFoundException('Option not found');

    option.votes += 1;
    await option.save();

    const updatedPoll = await this.pollModel.findById(pollId).populate('options').exec();

    if (!updatedPoll) {
      throw new NotFoundException('Poll not found');
    }

    this.pubSub.publish('pollUpdated', { pollUpdated: updatedPoll });

    return updatedPoll;
  }
}
