import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consent, ConsentStatus, ConsentType } from './entities/consent.entity';
import { Connection, ConnectionStatus } from './entities/connection.entity';
import { AccessLog } from './entities/access-log.entity';
import { SharingRule, SharingRuleStatus } from './entities/sharing-rule.entity';

@Injectable()
export class ConsentRepository {
  constructor(
    @InjectRepository(Consent)
    private readonly consentRepository: Repository<Consent>,
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
    @InjectRepository(AccessLog)
    private readonly accessLogRepository: Repository<AccessLog>,
    @InjectRepository(SharingRule)
    private readonly sharingRuleRepository: Repository<SharingRule>,
  ) {}

  // Consent operations
  async createConsent(consentData: Partial<Consent>): Promise<Consent> {
    const consent = this.consentRepository.create(consentData);
    return this.consentRepository.save(consent);
  }

  async findConsentById(id: string, relations: string[] = []): Promise<Consent | null> {
    return this.consentRepository.findOne({
      where: { id },
      relations,
    });
  }

  async findConsentsByPatient(patientId: string, status?: ConsentStatus): Promise<Consent[]> {
    const where: any = { patientId };
    if (status) where.status = status;

    return this.consentRepository.find({
      where,
      relations: ['doctor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findConsentsByDoctor(doctorId: string, status?: ConsentStatus): Promise<Consent[]> {
    const where: any = { doctorId };
    if (status) where.status = status;

    return this.consentRepository.find({
      where,
      relations: ['patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveConsent(patientId: string, doctorId: string): Promise<Consent | null> {
    return this.consentRepository.findOne({
      where: {
        patientId,
        doctorId,
        status: ConsentStatus.ACTIVE,
      },
    });
  }

  async updateConsent(id: string, updateData: Partial<Consent>): Promise<Consent> {
    await this.consentRepository.update(id, updateData);
    const updatedConsent = await this.findConsentById(id);
    if (!updatedConsent) {
      throw new Error('Consent not found after update');
    }
    return updatedConsent;
  }

  async deleteConsent(id: string): Promise<void> {
    await this.consentRepository.delete(id);
  }

  // Connection operations
  async createConnection(connectionData: Partial<Connection>): Promise<Connection> {
    const connection = this.connectionRepository.create(connectionData);
    return this.connectionRepository.save(connection);
  }

  async findConnectionById(id: string, relations: string[] = []): Promise<Connection | null> {
    return this.connectionRepository.findOne({
      where: { id },
      relations,
    });
  }

  async findConnection(requesterId: string, targetId: string): Promise<Connection | null> {
    return this.connectionRepository.findOne({
      where: [
        { requesterId, targetId },
        { requesterId: targetId, targetId: requesterId },
      ],
    });
  }

  async findConnectionsByUser(userId: string, userRole: string, status?: ConnectionStatus): Promise<Connection[]> {
    const where: any = {};
    if (userRole === 'patient') {
      where.patientId = userId;
    } else {
      where.doctorId = userId;
    }
    if (status) where.status = status;

    return this.connectionRepository.find({
      where,
      relations: ['patient', 'doctor', 'referredBy'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateConnection(id: string, updateData: Partial<Connection>): Promise<Connection> {
    await this.connectionRepository.update(id, updateData);
    const updatedConnection = await this.findConnectionById(id);
    if (!updatedConnection) {
      throw new Error('Connection not found after update');
    }
    return updatedConnection;
  }

  // Access log operations
  async createAccessLog(logData: Partial<AccessLog>): Promise<AccessLog> {
    const log = this.accessLogRepository.create(logData);
    return this.accessLogRepository.save(log);
  }

  async findAccessLogsByUser(userId: string, limit: number = 50): Promise<AccessLog[]> {
    return this.accessLogRepository.find({
      where: { userId },
      relations: ['consent'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findAccessLogsByRecord(recordId: string, limit: number = 50): Promise<AccessLog[]> {
    return this.accessLogRepository.find({
      where: { recordId },
      relations: ['user', 'consent'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findAccessLogsByConsent(consentId: string): Promise<AccessLog[]> {
    return this.accessLogRepository.find({
      where: { consentId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  // Sharing rule operations
  async createSharingRule(ruleData: Partial<SharingRule>): Promise<SharingRule> {
    const rule = this.sharingRuleRepository.create(ruleData);
    return this.sharingRuleRepository.save(rule);
  }

  async findSharingRulesByPatient(patientId: string): Promise<SharingRule[]> {
    return this.sharingRuleRepository.find({
      where: { patientId },
      relations: ['doctor'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveSharingRules(patientId: string, doctorId: string): Promise<SharingRule[]> {
    return this.sharingRuleRepository.find({
      where: {
        patientId,
        doctorId,
        status: SharingRuleStatus.ACTIVE,
      },
    });
  }

  async updateSharingRule(id: string, updateData: Partial<SharingRule>): Promise<SharingRule> {
    await this.sharingRuleRepository.update(id, updateData);
    const updatedRule = await this.sharingRuleRepository.findOne({ where: { id } });
    if (!updatedRule) {
      throw new Error('Sharing rule not found after update');
    }
    return updatedRule;
  }

  async deleteSharingRule(id: string): Promise<void> {
    await this.sharingRuleRepository.delete(id);
  }

  // Statistics
  async getConsentStats(): Promise<{
    totalConsents: number;
    activeConsents: number;
    revokedConsents: number;
    emergencyConsents: number;
  }> {
    const [totalConsents, activeConsents, revokedConsents, emergencyConsents] = await Promise.all([
      this.consentRepository.count(),
      this.consentRepository.count({ where: { status: ConsentStatus.ACTIVE } }),
      this.consentRepository.count({ where: { status: ConsentStatus.REVOKED } }),
      this.consentRepository.count({ where: { type: ConsentType.EMERGENCY_ACCESS } }),
    ]);

    return {
      totalConsents,
      activeConsents,
      revokedConsents,
      emergencyConsents,
    };
  }

  async getConnectionStats(): Promise<{
    totalConnections: number;
    pendingConnections: number;
    acceptedConnections: number;
    rejectedConnections: number;
  }> {
    const [totalConnections, pendingConnections, acceptedConnections, rejectedConnections] = await Promise.all([
      this.connectionRepository.count(),
      this.connectionRepository.count({ where: { status: ConnectionStatus.PENDING } }),
      this.connectionRepository.count({ where: { status: ConnectionStatus.ACCEPTED } }),
      this.connectionRepository.count({ where: { status: ConnectionStatus.REJECTED } }),
    ]);

    return {
      totalConnections,
      pendingConnections,
      acceptedConnections,
      rejectedConnections,
    };
  }
}