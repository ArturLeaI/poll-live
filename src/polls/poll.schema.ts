import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { VoteOption } from './vote-option.schema';

@Schema({ timestamps: true })
export class Poll {
  @Prop({ required: true })
  question: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'VoteOption' }] })
  options: VoteOption[];
}

export type PollDocument = Poll & Document;
export const PollSchema = SchemaFactory.createForClass(Poll);
