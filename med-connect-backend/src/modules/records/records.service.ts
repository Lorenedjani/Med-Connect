import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { UploadRecordDto } from './dto/upload-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { FilterRecordsDto } from './dto/filter-records.dto';
import { RecordMetadataDto, RecordListItemDto } from './dto/record-metadata.dto';
import { ShareRecordDto, RevokeShareDto } from './dto/share-record.dto';
import { StorageService } from './services/storage.service';
import { EncryptionService } from './services/encryption.service';
import { VersioningService } from './services/versioning.service';
import { RecordSearchService } from './services/record-search.service';
import { RecordCategory } from 'src/common/constants/record-categories.constant';
import { RecordsRepository } from './records.repository';
import { ConsentService } from '../consent/services/consent.service';
import { AccessAction, AccessResult } from '../consent/entities/access-log.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from 'src/common/constants/roles.constant';
import { IPaginatedResponse, PaginationMeta } from 'src/common/interfaces/pagination.interface';
import { RecordType } from 'src/common/constants/record-categories.constant';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private recordRepository: Repository<MedicalRecord>,
    private readonly recordsRepository: RecordsRepository,
    private readonly storageService: StorageService,
    private readonly encryptionService: EncryptionService,
    private readonly versioningService: VersioningService,
    private readonly recordSearchService: RecordSearchService,
    private readonly consentService: ConsentService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async initiateUpload(
    uploadDto: UploadRecordDto,
    patientId: string,
    uploadedById: string,
  ): Promise<{
    uploadUrl: string;
    recordId: string;
    fields?: Record<string, string>;
  }> {
    // Generate a temporary record ID for the upload
    const recordId = this.generateRecordId();

    // For now, we'll simulate file upload preparation
    // In a real implementation, this would prepare the storage upload
    const fileName = `temp-${recordId}`;
    const mimeType = 'application/octet-stream'; // Placeholder

    const uploadData = await this.storageService.generateUploadUrl(
      fileName,
      mimeType,
      patientId,
      recordId,
    );

    // Store temporary upload metadata (in a real app, this might go to Redis or a temp table)
    // For now, we'll just return the data

    return {
      uploadUrl: uploadData.uploadUrl,
      recordId,
      fields: uploadData.fields,
    };
  }

  async completeUpload(
    recordId: string,
    patientId: string,
    uploadedById: string,
    fileData: {
      fileName: string;
      originalFileName: string;
      mimeType: string;
      fileSize: number;
      fileUrl: string;
      fileKey?: string;
    },
  ): Promise<RecordMetadataDto> {
    // Validate file
    this.storageService.validateFile(
      fileData.originalFileName,
      fileData.mimeType,
      fileData.fileSize,
    );

    const fileType = this.storageService.getFileType(fileData.mimeType);

    // Create the medical record
    const record = await this.recordsRepository.createRecord({
      id: recordId,
      patientId,
      category: RecordCategory.LAB_RESULTS, // This would come from the upload DTO
      title: 'Uploaded Medical Record', // This would come from the upload DTO
      type: fileType,
      fileName: fileData.fileName,
      originalFileName: fileData.originalFileName,
      fileSize: fileData.fileSize,
      mimeType: fileData.mimeType,
      fileUrl: fileData.fileUrl,
      fileKey: fileData.fileKey,
      uploadedById,
      isEncrypted: this.encryptionService.shouldEncryptFile(fileData.mimeType),
    });

    // Index the record for search
    await this.recordSearchService.indexRecord({
      recordId: record.id,
      patientId: record.patientId,
      title: record.title,
      description: record.description,
      category: record.category,
      tags: record.tagsList,
    });

    // Emit record created event
    this.eventEmitter.emit('record.created', {
      record,
      uploadedById,
    });

    return this.mapToRecordMetadataDto(record);
  }

  async getRecords(
    patientId: string,
    filters: FilterRecordsDto,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<IPaginatedResponse<RecordListItemDto>> {
    // Access control is handled at the record level, not the list level
    // Individual records will be filtered based on consent when accessed

    const [records, total] = await this.recordsRepository.findRecords(patientId, filters);

    const recordDtos = records.map(record => this.mapToRecordListItemDto(record));

    // Access logging is done at the individual record level

    return {
      data: recordDtos,
      meta: new PaginationMeta(filters.page ?? 1, filters.limit ?? 20, total),
    };
  }

  async getRecord(
    recordId: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<RecordMetadataDto> {
    const record = await this.recordsRepository.findRecordById(recordId, ['patient', 'uploadedBy']);

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    // Check access permissions
    if (requestingUserRole !== UserRole.ADMIN && requestingUserId !== record.patientId) {
      const hasAccess = await this.consentService.checkRecordAccess(record.patientId, requestingUserId);

      if (!hasAccess) {
        // Log denied access
        await this.consentService.logRecordAccess(
          recordId,
          requestingUserId,
          AccessAction.VIEW,
          AccessResult.DENIED,
          undefined,
          { reason: 'Access denied to medical record' },
        );
        throw new ForbiddenException('Access denied to this record');
      }

      // Log successful access
      await this.consentService.logRecordAccess(
        recordId,
        requestingUserId,
        AccessAction.VIEW,
        AccessResult.SUCCESS,
      );
    }

    return this.mapToRecordMetadataDto(record);
  }

  async updateRecord(
    recordId: string,
    updateDto: UpdateRecordDto,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<RecordMetadataDto> {
    const record = await this.recordsRepository.findRecordById(recordId);

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    // Check permissions - only record owner or admin can update
    if (requestingUserRole !== UserRole.ADMIN && requestingUserId !== record.patientId) {
      throw new ForbiddenException('Access denied');
    }

    // Prepare update data
    const updateData: Partial<MedicalRecord> = {};

    if (updateDto.title !== undefined) updateData.title = updateDto.title;
    if (updateDto.description !== undefined) updateData.description = updateDto.description;
    if (updateDto.category !== undefined) updateData.category = updateDto.category;
    if (updateDto.recordDate !== undefined) updateData.recordDate = new Date(updateDto.recordDate);
    if (updateDto.tags !== undefined) updateData.tags = JSON.stringify(updateDto.tags);
    if (updateDto.isActive !== undefined) updateData.isActive = updateDto.isActive;

    const updatedRecord = await this.recordsRepository.updateRecord(recordId, updateData);

    // Update search index
    await this.recordSearchService.indexRecord({
      recordId: updatedRecord.id,
      patientId: updatedRecord.patientId,
      title: updatedRecord.title,
      description: updatedRecord.description,
      category: updatedRecord.category,
      tags: updatedRecord.tagsList,
    });

    return this.mapToRecordMetadataDto(updatedRecord);
  }

  async deleteRecord(
    recordId: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<void> {
    const record = await this.recordsRepository.findRecordById(recordId);

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    // Check permissions - only record owner or admin can delete
    if (requestingUserRole !== UserRole.ADMIN && requestingUserId !== record.patientId) {
      throw new ForbiddenException('Access denied');
    }

    // Delete from storage
    if (record.fileKey) {
      await this.storageService.deleteFile(record.fileKey);
    }

    // Delete from search index
    await this.recordSearchService.deleteRecord(recordId);

    // Delete from database
    await this.recordsRepository.deleteRecord(recordId);

    // Emit record deleted event
    this.eventEmitter.emit('record.deleted', {
      recordId,
      patientId: record.patientId,
      deletedById: requestingUserId,
    });
  }

  async shareRecord(
    recordId: string,
    shareDto: ShareRecordDto,
    requestingUserId: string,
  ): Promise<void> {
    const record = await this.recordsRepository.findRecordById(recordId);

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    // Only record owner can share
    if (requestingUserId !== record.patientId) {
      throw new ForbiddenException('Only record owner can share records');
    }

    // Update search index with access permissions
    await this.recordSearchService.updateRecordAccess(
      recordId,
      [shareDto.userId],
      false,
    );

    // Emit record shared event
    this.eventEmitter.emit('record.shared', {
      recordId,
      sharedWithUserId: shareDto.userId,
      sharedByUserId: requestingUserId,
      permission: shareDto.permission,
      expiresAt: shareDto.expiresAt ? new Date(shareDto.expiresAt) : undefined,
    });
  }

  async getDownloadUrl(
    recordId: string,
    requestingUserId: string,
    requestingUserRole: UserRole,
  ): Promise<string> {
    const record = await this.getRecord(recordId, requestingUserId, requestingUserRole);

    // Log download access
    if (requestingUserId !== record.patientId) {
      await this.consentService.logRecordAccess(
        recordId,
        requestingUserId,
        AccessAction.DOWNLOAD,
        AccessResult.SUCCESS,
      );
    }

    return await this.storageService.generateDownloadUrl(record.fileUrl);
  }


  private generateRecordId(): string {
    // Generate a UUID-like string
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private mapToRecordMetadataDto(record: MedicalRecord): RecordMetadataDto {
    return {
      id: record.id,
      patientId: record.patientId,
      category: record.category,
      title: record.title,
      description: record.description,
      type: record.type,
      fileName: record.fileName,
      originalFileName: record.originalFileName,
      fileSize: record.fileSize,
      fileSizeFormatted: record.fileSizeFormatted,
      mimeType: record.mimeType,
      fileUrl: record.fileUrl,
      recordDate: record.recordDate,
      tags: record.tagsList,
      isEncrypted: record.isEncrypted,
      isActive: record.isActive,
      uploadedById: record.uploadedById,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private mapToRecordListItemDto(record: MedicalRecord): RecordListItemDto {
    return {
      id: record.id,
      title: record.title,
      category: record.category,
      fileSize: record.fileSize,
      fileSizeFormatted: record.fileSizeFormatted,
      recordDate: record.recordDate,
      createdAt: record.createdAt,
      tags: record.tagsList,
    };
  }
}