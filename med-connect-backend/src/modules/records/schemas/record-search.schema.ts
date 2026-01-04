import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RecordCategory } from '../../../common/constants/record-categories.constant';

export type RecordSearchDocument = RecordSearch & Document;

@Schema({ timestamps: true })
export class RecordSearch {
  @Prop({ required: true })
  recordId: string;

  @Prop({ required: true })
  patientId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    enum: RecordCategory,
  })
  category: RecordCategory;

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: Object })
  searchContent: {
    fullText: string;
    keywords: string[];
    entities: {
      medications?: string[];
      conditions?: string[];
      procedures?: string[];
      labValues?: Array<{
        test: string;
        value: string;
        unit: string;
        referenceRange?: string;
      }>;
    };
  };

  @Prop({ type: Date })
  recordDate?: Date;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ default: 1.0 })
  relevanceScore: number;

  @Prop({ type: Object })
  accessControl: {
    isPublic: boolean;
    allowedUserIds: string[];
    blockedUserIds: string[];
  };

  @Prop({ default: true })
  isActive: boolean;
}

export const RecordSearchSchema = SchemaFactory.createForClass(RecordSearch);

// Add indexes for search performance
RecordSearchSchema.index({ patientId: 1, isActive: 1 });
RecordSearchSchema.index({ category: 1, patientId: 1 });
RecordSearchSchema.index({ recordDate: -1 });
RecordSearchSchema.index({ tags: 1 });
RecordSearchSchema.index({ 'searchContent.keywords': 1 });
RecordSearchSchema.index({ 'searchContent.fullText': 'text' });
RecordSearchSchema.index({ 'accessControl.allowedUserIds': 1 });
RecordSearchSchema.index({ relevanceScore: -1 });