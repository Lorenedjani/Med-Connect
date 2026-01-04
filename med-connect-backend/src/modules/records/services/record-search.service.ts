import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RecordSearch, RecordSearchDocument } from '../schemas/record-search.schema';
import { FilterRecordsDto } from '../dto/filter-records.dto';
import { RecordCategory } from '../../../common/constants/record-categories.constant';
import { IPaginatedResponse, PaginationMeta } from '../../../common/interfaces/pagination.interface';

@Injectable()
export class RecordSearchService {
  constructor(
    @InjectModel(RecordSearch.name)
    private recordSearchModel: Model<RecordSearchDocument>,
  ) {}

  async indexRecord(recordData: {
    recordId: string;
    patientId: string;
    title: string;
    description?: string;
    category: RecordCategory;
    tags?: string[];
    content?: string;
    recordDate?: Date;
  }): Promise<void> {
    const searchDocument = {
      recordId: recordData.recordId,
      patientId: recordData.patientId,
      title: recordData.title,
      description: recordData.description || '',
      category: recordData.category,
      tags: recordData.tags || [],
      searchContent: {
        fullText: this.buildFullTextContent(recordData),
        keywords: this.extractKeywords(recordData),
        entities: this.extractEntities(recordData.content || ''),
      },
      recordDate: recordData.recordDate,
      accessControl: {
        isPublic: false,
        allowedUserIds: [],
        blockedUserIds: [],
      },
      isActive: true,
    };

    await this.recordSearchModel.findOneAndUpdate(
      { recordId: recordData.recordId },
      searchDocument,
      { upsert: true, new: true },
    );
  }

  async searchRecords(
    patientId: string,
    filters: FilterRecordsDto,
  ): Promise<IPaginatedResponse<RecordSearch>> {
    const query = this.buildSearchQuery(patientId, filters);
    const sort = this.buildSortQuery(filters.sortBy, filters.sortOrder);

    const skip = ((filters.page ?? 1) - 1) * (filters.limit ?? 20);
    const limit = filters.limit ?? 20;

    const [records, total] = await Promise.all([
      this.recordSearchModel
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.recordSearchModel.countDocuments(query).exec(),
    ]);

    return {
      data: records,
      meta: new PaginationMeta(filters.page ?? 1, filters.limit ?? 20, total),
    };
  }

  async updateRecordAccess(
    recordId: string,
    allowedUserIds: string[] = [],
    isPublic: boolean = false,
  ): Promise<void> {
    await this.recordSearchModel.findOneAndUpdate(
      { recordId },
      {
        'accessControl.allowedUserIds': allowedUserIds,
        'accessControl.isPublic': isPublic,
      },
    );
  }

  async removeRecord(recordId: string): Promise<void> {
    await this.recordSearchModel.findOneAndUpdate(
      { recordId },
      { isActive: false },
    );
  }

  async deleteRecord(recordId: string): Promise<void> {
    await this.recordSearchModel.findOneAndDelete({ recordId });
  }

  async getRelatedRecords(
    recordId: string,
    patientId: string,
    limit: number = 5,
  ): Promise<RecordSearch[]> {
    const record = await this.recordSearchModel.findOne({ recordId });

    if (!record) {
      return [];
    }

    // Find records with similar tags or in the same category
    const relatedQuery = {
      patientId,
      recordId: { $ne: recordId },
      isActive: true,
      $or: [
        { category: record.category },
        { tags: { $in: record.tags } },
      ],
    };

    return await this.recordSearchModel
      .find(relatedQuery)
      .limit(limit)
      .sort({ relevanceScore: -1 })
      .exec();
  }

  async updateRelevanceScore(recordId: string, score: number): Promise<void> {
    await this.recordSearchModel.findOneAndUpdate(
      { recordId },
      { relevanceScore: score },
    );
  }

  private buildSearchQuery(patientId: string, filters: FilterRecordsDto) {
    const query: any = {
      patientId,
      isActive: filters.includeInactive !== true,
    };

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    if (filters.dateFrom || filters.dateTo) {
      query.recordDate = {};
      if (filters.dateFrom) {
        query.recordDate.$gte = new Date(filters.dateFrom);
      }
      if (filters.dateTo) {
        query.recordDate.$lte = new Date(filters.dateTo);
      }
    }

    if (filters.createdFrom || filters.createdTo) {
      query.createdAt = {};
      if (filters.createdFrom) {
        query.createdAt.$gte = new Date(filters.createdFrom);
      }
      if (filters.createdTo) {
        query.createdAt.$lte = new Date(filters.createdTo);
      }
    }

    return query;
  }

  private buildSortQuery(sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'DESC') {
    const sort: any = {};

    switch (sortBy) {
      case 'title':
        sort.title = sortOrder === 'DESC' ? -1 : 1;
        break;
      case 'category':
        sort.category = sortOrder === 'DESC' ? -1 : 1;
        break;
      case 'recordDate':
        sort.recordDate = sortOrder === 'DESC' ? -1 : 1;
        break;
      case 'fileSize':
        sort['searchContent.fileSize'] = sortOrder === 'DESC' ? -1 : 1;
        break;
      case 'relevance':
        sort.relevanceScore = sortOrder === 'DESC' ? -1 : 1;
        break;
      default:
        sort.createdAt = sortOrder === 'DESC' ? -1 : 1;
    }

    return sort;
  }

  private buildFullTextContent(recordData: any): string {
    const parts = [
      recordData.title,
      recordData.description,
      recordData.content,
      ...(recordData.tags || []),
    ];

    return parts.filter(Boolean).join(' ').toLowerCase();
  }

  private extractKeywords(recordData: any): string[] {
    const text = this.buildFullTextContent(recordData);
    const words = text.split(/\s+/);

    // Filter out common stop words and short words
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    const keywords = words
      .filter(word => word.length > 2 && !stopWords.includes(word.toLowerCase()))
      .map(word => word.toLowerCase());

    // Remove duplicates and limit to top keywords
    return [...new Set(keywords)].slice(0, 20);
  }

  private extractEntities(content: string): any {
    // This would integrate with NLP/AI services to extract medical entities
    // For now, return a basic structure
    return {
      medications: [],
      conditions: [],
      procedures: [],
      labValues: [],
    };
  }
}