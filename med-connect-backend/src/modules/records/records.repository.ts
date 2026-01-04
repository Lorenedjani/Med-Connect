import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { FilterRecordsDto } from './dto/filter-records.dto';
import { RecordCategory } from '../../common/constants/record-categories.constant';

@Injectable()
export class RecordsRepository {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly recordRepository: Repository<MedicalRecord>,
  ) {}

  async createRecord(recordData: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const record = this.recordRepository.create(recordData);
    return this.recordRepository.save(record);
  }

  async findRecordById(id: string, relations: string[] = []): Promise<MedicalRecord | null> {
    return this.recordRepository.findOne({
      where: { id },
      relations,
    });
  }

  async findRecordsByPatientId(
    patientId: string,
    relations: string[] = [],
  ): Promise<MedicalRecord[]> {
    return this.recordRepository.find({
      where: { patientId, isActive: true },
      relations,
      order: { createdAt: 'DESC' },
    });
  }

  async findRecords(
    patientId: string,
    filters: FilterRecordsDto,
  ): Promise<[MedicalRecord[], number]> {
    const queryBuilder = this.recordRepository.createQueryBuilder('record');

    // Base conditions
    queryBuilder.where('record.patientId = :patientId', { patientId });
    queryBuilder.andWhere('record.isActive = :isActive', {
      isActive: filters.includeInactive !== true,
    });

    // Apply filters
    this.applyFilters(queryBuilder, filters);

    // Apply sorting
    this.applySorting(queryBuilder, filters.sortBy, filters.sortOrder);

    // Apply pagination
    const skip = ((filters.page ?? 1) - 1) * (filters.limit ?? 20);
    queryBuilder.skip(skip).take(filters.limit ?? 20);

    return queryBuilder.getManyAndCount();
  }

  async updateRecord(id: string, updateData: Partial<MedicalRecord>): Promise<MedicalRecord> {
    await this.recordRepository.update(id, updateData);
    const updatedRecord = await this.findRecordById(id);
    if (!updatedRecord) {
      throw new Error('Record not found after update');
    }
    return updatedRecord;
  }

  async deleteRecord(id: string): Promise<void> {
    await this.recordRepository.update(id, { isActive: false });
  }

  async hardDeleteRecord(id: string): Promise<void> {
    await this.recordRepository.delete(id);
  }

  async getRecordsCount(patientId: string): Promise<number> {
    return this.recordRepository.count({
      where: { patientId, isActive: true },
    });
  }

  async getRecordsByCategory(
    patientId: string,
    category: RecordCategory,
  ): Promise<MedicalRecord[]> {
    return this.recordRepository.find({
      where: { patientId, category, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getRecordsSize(patientId: string): Promise<number> {
    const result = await this.recordRepository
      .createQueryBuilder('record')
      .select('SUM(record.fileSize)', 'totalSize')
      .where('record.patientId = :patientId', { patientId })
      .andWhere('record.isActive = :isActive', { isActive: true })
      .getRawOne();

    return parseInt(result?.totalSize || '0', 10);
  }

  async searchRecords(
    patientId: string,
    searchTerm: string,
    limit: number = 20,
  ): Promise<MedicalRecord[]> {
    const queryBuilder = this.recordRepository.createQueryBuilder('record');

    queryBuilder
      .where('record.patientId = :patientId', { patientId })
      .andWhere('record.isActive = :isActive', { isActive: true })
      .andWhere(
        '(record.title ILIKE :search OR record.description ILIKE :search)',
        { search: `%${searchTerm}%` },
      )
      .orderBy('record.createdAt', 'DESC')
      .limit(limit);

    return queryBuilder.getMany();
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<MedicalRecord>, filters: FilterRecordsDto): void {
    if (filters.category) {
      queryBuilder.andWhere('record.category = :category', { category: filters.category });
    }

    if (filters.search) {
      queryBuilder.andWhere(
        '(record.title ILIKE :search OR record.description ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      // This assumes tags are stored as JSON array
      // In a real implementation, you might want to use a more sophisticated search
      const tagConditions = filters.tags.map((tag, index) =>
        `record.tags LIKE :tag${index}`
      ).join(' OR ');

      const tagParameters = {};
      filters.tags.forEach((tag, index) => {
        tagParameters[`tag${index}`] = `%"${tag}"%`;
      });

      queryBuilder.andWhere(`(${tagConditions})`, tagParameters);
    }

    if (filters.dateFrom || filters.dateTo) {
      if (filters.dateFrom) {
        queryBuilder.andWhere('record.recordDate >= :dateFrom', {
          dateFrom: new Date(filters.dateFrom),
        });
      }
      if (filters.dateTo) {
        queryBuilder.andWhere('record.recordDate <= :dateTo', {
          dateTo: new Date(filters.dateTo),
        });
      }
    }

    if (filters.createdFrom || filters.createdTo) {
      if (filters.createdFrom) {
        queryBuilder.andWhere('record.createdAt >= :createdFrom', {
          createdFrom: new Date(filters.createdFrom),
        });
      }
      if (filters.createdTo) {
        queryBuilder.andWhere('record.createdAt <= :createdTo', {
          createdTo: new Date(filters.createdTo),
        });
      }
    }
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<MedicalRecord>,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): void {
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    switch (sortBy) {
      case 'title':
        queryBuilder.orderBy('record.title', order);
        break;
      case 'category':
        queryBuilder.orderBy('record.category', order);
        break;
      case 'recordDate':
        queryBuilder.orderBy('record.recordDate', order);
        break;
      case 'fileSize':
        queryBuilder.orderBy('record.fileSize', order);
        break;
      case 'createdAt':
      default:
        queryBuilder.orderBy('record.createdAt', order);
        break;
    }
  }
}