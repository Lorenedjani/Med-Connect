import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DocumentMetadataDocument = DocumentMetadata & Document;

@Schema({ timestamps: true })
export class DocumentMetadata {
  @Prop({ required: true })
  recordId: string;

  @Prop({ required: true })
  patientId: string;

  @Prop({ type: Object })
  ocrText?: {
    content: string;
    confidence: number;
    extractedAt: Date;
  };

  @Prop({ type: Object })
  aiAnalysis?: {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    analyzedAt: Date;
    model: string;
  };

  @Prop({ type: [Object] })
  tags?: Array<{
    key: string;
    value: string;
    confidence?: number;
  }>;

  @Prop({ type: Object })
  metadata?: {
    language?: string;
    pageCount?: number;
    hasImages?: boolean;
    compression?: string;
    resolution?: string;
  };

  @Prop({ default: false })
  isProcessed: boolean;

  @Prop()
  processedAt?: Date;

  @Prop({ type: Object })
  searchIndex?: {
    keywords: string[];
    entities: string[];
    lastIndexed: Date;
  };
}

export const DocumentMetadataSchema = SchemaFactory.createForClass(DocumentMetadata);

// Add indexes for search performance
DocumentMetadataSchema.index({ patientId: 1, recordId: 1 });
DocumentMetadataSchema.index({ 'searchIndex.keywords': 1 });
DocumentMetadataSchema.index({ 'ocrText.content': 'text' });
DocumentMetadataSchema.index({ isProcessed: 1 });