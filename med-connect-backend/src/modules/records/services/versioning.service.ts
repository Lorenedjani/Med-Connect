import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from '../entities/medical-record.entity';
import { RecordVersion } from '../entities/record-version.entity';
import { StorageService } from './storage.service';

@Injectable()
export class VersioningService {
  constructor(
    @InjectRepository(MedicalRecord)
    private recordRepository: Repository<MedicalRecord>,
    @InjectRepository(RecordVersion)
    private versionRepository: Repository<RecordVersion>,
    private storageService: StorageService,
  ) {}

  async createVersion(
    recordId: string,
    newFileData: {
      fileName: string;
      fileSize: number;
      mimeType: string;
      fileUrl: string;
      fileKey?: string;
    },
    changeLog?: string,
    createdById?: string,
  ): Promise<RecordVersion> {
    const record = await this.recordRepository.findOne({
      where: { id: recordId },
    });

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    // Get the next version number by querying the versions
    const latestVersion = await this.versionRepository
      .createQueryBuilder('version')
      .where('version.recordId = :recordId', { recordId })
      .orderBy('version.versionNumber', 'DESC')
      .getOne();

    const currentVersion = latestVersion ? latestVersion.versionNumber : 0;
    const nextVersionNumber = currentVersion + 1;

    // Create the new version
    const version = this.versionRepository.create({
      recordId,
      versionNumber: nextVersionNumber,
      fileName: newFileData.fileName,
      fileSize: newFileData.fileSize,
      mimeType: newFileData.mimeType,
      fileUrl: newFileData.fileUrl,
      fileKey: newFileData.fileKey,
      changeLog,
      createdById,
    });

    return await this.versionRepository.save(version);
  }

  async getVersions(recordId: string): Promise<RecordVersion[]> {
    return await this.versionRepository.find({
      where: { recordId },
      order: { versionNumber: 'DESC' },
    });
  }

  async getVersion(versionId: string): Promise<RecordVersion> {
    const version = await this.versionRepository.findOne({
      where: { id: versionId },
      relations: ['record'],
    });

    if (!version) {
      throw new NotFoundException('Record version not found');
    }

    return version;
  }

  async restoreVersion(versionId: string, restoredById: string): Promise<MedicalRecord> {
    const version = await this.getVersion(versionId);

    // Update the main record with version data
    await this.recordRepository.update(version.recordId, {
      fileName: version.fileName,
      fileSize: version.fileSize,
      mimeType: version.mimeType,
      fileUrl: version.fileUrl,
      fileKey: version.fileKey,
    });

    // Create a new version entry for the restoration
    const restorationVersion = this.versionRepository.create({
      recordId: version.recordId,
      versionNumber: version.versionNumber + 1,
      fileName: version.fileName,
      fileSize: version.fileSize,
      mimeType: version.mimeType,
      fileUrl: version.fileUrl,
      fileKey: version.fileKey,
      changeLog: `Restored from version ${version.versionNumber}`,
      createdById: restoredById,
    });

    await this.versionRepository.save(restorationVersion);

    const restoredRecord = await this.recordRepository.findOne({
      where: { id: version.recordId },
    });

    if (!restoredRecord) {
      throw new Error('Record not found after restoration');
    }

    return restoredRecord;
  }

  async deleteVersion(versionId: string): Promise<void> {
    const version = await this.getVersion(versionId);

    // Don't allow deletion of the only version
    const versionCount = await this.versionRepository.count({
      where: { recordId: version.recordId },
    });

    if (versionCount <= 1) {
      throw new Error('Cannot delete the only version of a record');
    }

    // Delete the file from storage if it exists
    if (version.fileKey) {
      await this.storageService.deleteFile(version.fileKey);
    }

    await this.versionRepository.delete(versionId);
  }

  async getVersionCount(recordId: string): Promise<number> {
    return await this.versionRepository.count({
      where: { recordId },
    });
  }

  async getLatestVersion(recordId: string): Promise<RecordVersion | null> {
    const versions = await this.versionRepository.find({
      where: { recordId },
      order: { versionNumber: 'DESC' },
      take: 1,
    });

    return versions[0] || null;
  }

  async cleanupOldVersions(recordId: string, keepVersions: number = 5): Promise<void> {
    const versions = await this.versionRepository.find({
      where: { recordId },
      order: { versionNumber: 'DESC' },
    });

    if (versions.length <= keepVersions) {
      return;
    }

    const versionsToDelete = versions.slice(keepVersions);

    for (const version of versionsToDelete) {
      await this.deleteVersion(version.id);
    }
  }
}