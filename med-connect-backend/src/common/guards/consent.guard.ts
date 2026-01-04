import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../constants/roles.constant';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

export const CONSENT_CHECK_KEY = 'consentCheck';
export const ConsentCheck = (resourceType: string) =>
  Reflector.createDecorator<string>({ key: CONSENT_CHECK_KEY });

@Injectable()
export class ConsentGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resourceType = this.reflector.getAllAndOverride<string>(CONSENT_CHECK_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!resourceType) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admins have access to everything
    if (user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // For consent-based resources, check if the user has been granted access
    const resourceId = this.extractResourceId(request, resourceType);

    if (!resourceId) {
      return true; // Let the controller handle validation
    }

    // Check consent based on resource type
    switch (resourceType) {
      case 'medical-record':
        return this.checkMedicalRecordAccess(user.sub, resourceId);
      case 'patient-data':
        return this.checkPatientDataAccess(user.sub, resourceId);
      case 'appointment':
        return this.checkAppointmentAccess(user.sub, resourceId);
      default:
        return false;
    }
  }

  private extractResourceId(request: any, resourceType: string): string | null {
    const { params, body, query } = request;

    // Try different sources for the resource ID
    return params.id || body.resourceId || query.resourceId || null;
  }

  private async checkMedicalRecordAccess(userId: string, recordId: string): Promise<boolean> {
    // This would typically query the database to check:
    // 1. If the user is the owner of the record
    // 2. If there's an active consent granting access to the record

    // For now, return true - implement actual logic based on your entities
    // Example implementation:
    /*
    const record = await this.medicalRecordRepository.findOne({
      where: { id: recordId },
      relations: ['patient', 'consents'],
    });

    if (!record) return false;

    // Owner has access
    if (record.patient.id === userId) return true;

    // Check active consents
    const activeConsent = record.consents.find(
      consent => consent.doctor.id === userId &&
      consent.status === 'active' &&
      consent.expiresAt > new Date()
    );

    return !!activeConsent;
    */

    return true; // Placeholder
  }

  private async checkPatientDataAccess(userId: string, patientId: string): Promise<boolean> {
    // Similar logic for patient data access
    return true; // Placeholder
  }

  private async checkAppointmentAccess(userId: string, appointmentId: string): Promise<boolean> {
    // Check if user is participant in the appointment
    return true; // Placeholder
  }
}

