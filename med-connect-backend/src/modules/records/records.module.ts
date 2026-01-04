import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalRecord } from './entities/medical-record.entity';
import { RecordVersion } from './entities/record-version.entity';
import { RecordCategoryEntity } from './entities/category.entity';
import { DocumentMetadata, DocumentMetadataSchema } from './schemas/document-metadata.schema';
import { RecordSearch, RecordSearchSchema } from './schemas/record-search.schema';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { RecordsRepository } from './records.repository';
import { StorageService } from './services/storage.service';
import { EncryptionService } from './services/encryption.service';
import { VersioningService } from './services/versioning.service';
import { RecordSearchService } from './services/record-search.service';
import { ConsentModule } from '../consent/consent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MedicalRecord, RecordVersion, RecordCategoryEntity]),
    MongooseModule.forFeature([
      { name: DocumentMetadata.name, schema: DocumentMetadataSchema },
      { name: RecordSearch.name, schema: RecordSearchSchema },
    ]),
    ConsentModule,
  ],
  controllers: [RecordsController],
  providers: [
    RecordsService,
    RecordsRepository,
    StorageService,
    EncryptionService,
    VersioningService,
    RecordSearchService,
  ],
  exports: [RecordsService, RecordsRepository],
})
export class RecordsModule {}