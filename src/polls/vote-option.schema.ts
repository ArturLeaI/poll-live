import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class VoteOption {
  @Prop({ required: true })
  text: string;

  @Prop({ default: 0 })
  votes: number;
}

export type VoteOptionDocument = VoteOption & Document;
export const VoteOptionSchema = SchemaFactory.createForClass(VoteOption);
