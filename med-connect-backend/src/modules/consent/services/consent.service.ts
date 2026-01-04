import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consent, ConsentStatus, ConsentPermission } from '../entities/consent.entity';
import { Connection, ConnectionStatus } from '../entities/connection.entity';
import { AccessLog, AccessAction, AccessResult } from '../entities/access-log.entity';
import { CreateConsentDto } from '../dto/create-consent.dto';
import { UpdateConsentDto } from '../dto/update-consent.dto';
import { CreateConnectionRequestDto } from '../dto/connection-request.dto';
import { AcceptConnectionDto, RejectConnectionDto } from '../dto/accept-connection.dto';
import { GrantAccessDto, RevokeAccessDto } from '../dto/grant-access.dto';
import { ConsentGrantedEvent } from '../events/consent-granted.event';
import { ConsentRevokedEvent } from '../events/consent-revoked.event';
import { ConnectionRequestedEvent } from '../events/connection-requested.event';
import { RecordAccessedEvent } from '../events/record-accessed.event';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../../common/constants/roles.constant';

@Injectable()
export class ConsentService {
  constructor(
    @InjectRepository(Consent)
    private consentRepository: Repository<Consent>,
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
    @InjectRepository(AccessLog)
    private accessLogRepository: Repository<AccessLog>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  // Consent Management
  async createConsent(patientId: string, createDto: CreateConsentDto): Promise<Consent> {
    // Validate that patient and doctor exist
    const patient = await this.userRepository.findOne({ where: { id: patientId } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const doctor = await this.userRepository.findOne({ where: { id: createDto.doctorId } });
    if (!doctor || doctor.role !== UserRole.DOCTOR) {
      throw new NotFoundException('Doctor not found');
    }

    // Check if consent already exists
    const existingConsent = await this.consentRepository.findOne({
      where: {
        patientId,
        doctorId: createDto.doctorId,
        status: ConsentStatus.ACTIVE,
      },
    });

    if (existingConsent) {
      throw new ConflictException('Active consent already exists for this doctor');
    }

    // Create consent
    const consent = this.consentRepository.create({
      patientId,
      doctorId: createDto.doctorId,
      type: createDto.type,
      permission: createDto.permission,
      description: createDto.description,
      expiresAt: createDto.expiresAt ? new Date(createDto.expiresAt) : undefined,
      status: createDto.grantImmediately ? ConsentStatus.ACTIVE : ConsentStatus.PENDING,
      grantedAt: createDto.grantImmediately ? new Date() : undefined,
      grantedById: createDto.grantImmediately ? patientId : undefined,
    });

    const savedConsent = await this.consentRepository.save(consent);

    if (createDto.grantImmediately) {
      this.eventEmitter.emit('consent.granted', new ConsentGrantedEvent(
        savedConsent.id,
        patientId,
        createDto.doctorId,
        createDto.permission,
        patientId,
      ));
    }

    return savedConsent;
  }

  async updateConsent(consentId: string, updateDto: UpdateConsentDto, userId: string): Promise<Consent> {
    const consent = await this.consentRepository.findOne({
      where: { id: consentId },
      relations: ['patient', 'doctor'],
    });

    if (!consent) {
      throw new NotFoundException('Consent not found');
    }

    // Only patient or doctor can update consent
    if (consent.patientId !== userId && consent.doctorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    // Update consent
    if (updateDto.status) consent.status = updateDto.status;
    if (updateDto.permission) consent.permission = updateDto.permission;
    if (updateDto.description !== undefined) consent.description = updateDto.description;
    if (updateDto.expiresAt) consent.expiresAt = new Date(updateDto.expiresAt);

    // Handle status changes
    if (updateDto.status === ConsentStatus.ACTIVE && consent.status !== ConsentStatus.ACTIVE) {
      consent.grantedAt = new Date();
      consent.grantedById = userId;

      this.eventEmitter.emit('consent.granted', new ConsentGrantedEvent(
        consent.id,
        consent.patientId,
        consent.doctorId,
        consent.permission,
        userId,
      ));
    } else if (updateDto.status === ConsentStatus.REVOKED && consent.status === ConsentStatus.ACTIVE) {
      consent.revokedAt = new Date();
      consent.revokedById = userId;

      this.eventEmitter.emit('consent.revoked', new ConsentRevokedEvent(
        consent.id,
        consent.patientId,
        consent.doctorId,
        userId,
        'Revoked by user',
      ));
    }

    return this.consentRepository.save(consent);
  }

  async getConsents(patientId: string, userId: string): Promise<Consent[]> {
    // Users can only see their own consents
    if (patientId !== userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.consentRepository.find({
      where: { patientId },
      relations: ['doctor', 'patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async getDoctorConsents(doctorId: string, userId: string): Promise<Consent[]> {
    // Doctors can only see consents granted to them
    if (doctorId !== userId) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.consentRepository.find({
      where: { doctorId },
      relations: ['doctor', 'patient'],
      order: { createdAt: 'DESC' },
    });
  }

  // Connection Management
  async createConnectionRequest(requesterId: string, createDto: CreateConnectionRequestDto): Promise<Connection> {
    // Validate users exist
    const requester = await this.userRepository.findOne({ where: { id: requesterId } });
    const target = await this.userRepository.findOne({ where: { id: createDto.targetUserId } });

    if (!requester || !target) {
      throw new NotFoundException('User not found');
    }

    // Check if connection already exists
    const existingConnection = await this.connectionRepository.findOne({
      where: [
        { requesterId, targetId: createDto.targetUserId },
        { requesterId: createDto.targetUserId, targetId: requesterId },
      ],
    });

    if (existingConnection) {
      throw new ConflictException('Connection already exists');
    }

    // Create connection
    const connection = this.connectionRepository.create({
      requesterId,
      targetId: createDto.targetUserId,
      type: createDto.type,
      message: createDto.message,
    });

    const savedConnection = await this.connectionRepository.save(connection);

    this.eventEmitter.emit('connection.requested', new ConnectionRequestedEvent(
      savedConnection.id,
      requesterId,
      createDto.targetUserId,
      createDto.type,
      createDto.message,
    ));

    return savedConnection;
  }

  async acceptConnection(connectionId: string, userId: string, acceptDto: AcceptConnectionDto): Promise<Connection> {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
      relations: ['requester', 'target'],
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    // Only target can accept
    if (connection.targetId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new ConflictException('Connection is not pending');
    }

    connection.status = ConnectionStatus.ACCEPTED;
    connection.acceptedAt = new Date();
    connection.acceptedById = userId;

    return this.connectionRepository.save(connection);
  }

  async rejectConnection(connectionId: string, userId: string, rejectDto: RejectConnectionDto): Promise<Connection> {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
      relations: ['requester', 'target'],
    });

    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    // Only target can reject
    if (connection.targetId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new ConflictException('Connection is not pending');
    }

    connection.status = ConnectionStatus.REJECTED;
    connection.rejectedAt = new Date();
    connection.rejectedById = userId;
    connection.rejectReason = rejectDto.reason;

    return this.connectionRepository.save(connection);
  }

  async getConnections(userId: string): Promise<Connection[]> {
    return this.connectionRepository.find({
      where: [
        { requesterId: userId },
        { targetId: userId },
      ],
      relations: ['requester', 'target'],
      order: { createdAt: 'DESC' },
    });
  }

  // Access Control
  async checkRecordAccess(recordPatientId: string, requestingUserId: string): Promise<boolean> {
    // If user is the record owner, allow access
    if (recordPatientId === requestingUserId) {
      return true;
    }

    // Check for active consent
    const consent = await this.consentRepository.findOne({
      where: {
        patientId: recordPatientId,
        doctorId: requestingUserId,
        status: ConsentStatus.ACTIVE,
      },
    });

    return !!consent && consent.isActive;
  }

  async logRecordAccess(
    recordId: string,
    userId: string,
    action: AccessAction,
    result: AccessResult,
    consentId?: string,
    metadata?: any,
  ): Promise<void> {
    const accessLog = this.accessLogRepository.create({
      recordId,
      userId,
      action,
      result,
      consentId,
      metadata,
      accessedAt: new Date(),
    });

    await this.accessLogRepository.save(accessLog);

    this.eventEmitter.emit('record.accessed', new RecordAccessedEvent(
      recordId,
      userId,
      action,
      result,
      consentId,
      metadata,
    ));
  }

  async getAccessLogs(recordId: string, userId: string): Promise<AccessLog[]> {
    // Only record owner or admin can view access logs
    const record = await this.consentRepository.findOne({
      where: { id: recordId },
    });

    if (!record || (record.patientId !== userId)) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user?.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Access denied');
      }
    }

    return this.accessLogRepository.find({
      where: { recordId },
      relations: ['user'],
      order: { accessedAt: 'DESC' },
    });
  }
}
