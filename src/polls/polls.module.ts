import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';

import { Poll, PollSchema } from './poll.schema';
import { VoteOption, VoteOptionSchema } from './vote-option.schema';
import { PollsResolver } from './polls.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Poll.name, schema: PollSchema },
      { name: VoteOption.name, schema: VoteOptionSchema },
    ]),
  ],
  controllers: [PollsController],
  providers: [PollsService, PollsResolver],
})
export class PollsModule {}
