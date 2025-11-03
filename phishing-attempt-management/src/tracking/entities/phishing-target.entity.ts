import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhishingTargetDocument = PhishingTarget & Document;

@Schema({ timestamps: true })
export class PhishingTarget {
  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  targetMail: string;

  @Prop({ required: true, unique: true })
  targetHashcode: string;

  @Prop({ required: true, enum: ['created', 'clicked'], default: 'created' })
  status: 'created' | 'clicked';
}

export const PhishingTargetSchema =
  SchemaFactory.createForClass(PhishingTarget);
