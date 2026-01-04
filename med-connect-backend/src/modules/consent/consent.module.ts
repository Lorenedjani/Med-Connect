import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consent } from './entities/consent.entity';
import { Connection } from './entities/connection.entity';
import { AccessLog } from './entities/access-log.entity';
import { SharingRule } from './entities/sharing-rule.entity';
import { ConsentService } from './services/consent.service';
import { ConsentController } from './consent.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consent, Connection, AccessLog, SharingRule]),
  ],
  controllers: [ConsentController],
  providers: [ConsentService],
  exports: [ConsentService, TypeOrmModule],
})
export class ConsentModule {}