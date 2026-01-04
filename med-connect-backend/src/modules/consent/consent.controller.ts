import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { ConsentService } from './services/consent.service';
import { CreateConsentDto } from './dto/create-consent.dto';
import { UpdateConsentDto } from './dto/update-consent.dto';
import { CreateConnectionRequestDto } from './dto/connection-request.dto';
import { AcceptConnectionDto, RejectConnectionDto } from './dto/accept-connection.dto';
import { GrantAccessDto, RevokeAccessDto } from './dto/grant-access.dto';
import { ConsentType, ConsentPermission, ConsentStatus } from './entities/consent.entity';
import { CurrentUserId, CurrentUserRole } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants/roles.constant';

@ApiTags('consent')
@Controller('consent')
export class ConsentController {
  constructor(private readonly consentService: ConsentService) {}

  // Consent Management
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new consent request' })
  @ApiResponse({
    status: 201,
    description: 'Consent created successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Consent already exists',
  })
  async createConsent(
    @CurrentUserId() userId: string,
    @Body() createDto: CreateConsentDto,
  ) {
    return this.consentService.createConsent(userId, createDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user consents' })
  @ApiResponse({
    status: 200,
    description: 'Consents retrieved successfully',
  })
  async getConsents(@CurrentUserId() userId: string) {
    return this.consentService.getConsents(userId, userId);
  }

  @Get('doctor/:doctorId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get consents granted to a doctor' })
  @ApiParam({
    name: 'doctorId',
    description: 'Doctor ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Doctor consents retrieved successfully',
  })
  async getDoctorConsents(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.consentService.getDoctorConsents(doctorId, userId);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update consent' })
  @ApiParam({
    name: 'id',
    description: 'Consent ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Consent updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Consent not found',
  })
  async updateConsent(
    @Param('id', ParseUUIDPipe) consentId: string,
    @Body() updateDto: UpdateConsentDto,
    @CurrentUserId() userId: string,
  ) {
    return this.consentService.updateConsent(consentId, updateDto, userId);
  }

  // Connection Management
  @Post('connection')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create connection request' })
  @ApiResponse({
    status: 201,
    description: 'Connection request created successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Connection already exists',
  })
  async createConnectionRequest(
    @CurrentUserId() userId: string,
    @Body() createDto: CreateConnectionRequestDto,
  ) {
    return this.consentService.createConnectionRequest(userId, createDto);
  }

  @Post('connection/:id/accept')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept connection request' })
  @ApiParam({
    name: 'id',
    description: 'Connection ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Connection accepted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Connection not found',
  })
  async acceptConnection(
    @Param('id', ParseUUIDPipe) connectionId: string,
    @CurrentUserId() userId: string,
    @Body() acceptDto: AcceptConnectionDto,
  ) {
    return this.consentService.acceptConnection(connectionId, userId, acceptDto);
  }

  @Post('connection/:id/reject')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject connection request' })
  @ApiParam({
    name: 'id',
    description: 'Connection ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Connection rejected successfully',
  })
  async rejectConnection(
    @Param('id', ParseUUIDPipe) connectionId: string,
    @CurrentUserId() userId: string,
    @Body() rejectDto: RejectConnectionDto,
  ) {
    return this.consentService.rejectConnection(connectionId, userId, rejectDto);
  }

  @Get('connections')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user connections' })
  @ApiResponse({
    status: 200,
    description: 'Connections retrieved successfully',
  })
  async getConnections(@CurrentUserId() userId: string) {
    return this.consentService.getConnections(userId);
  }

  // Access Logs
  @Get('access-logs/:recordId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get access logs for a record' })
  @ApiParam({
    name: 'recordId',
    description: 'Record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Access logs retrieved successfully',
  })
  async getAccessLogs(
    @Param('recordId', ParseUUIDPipe) recordId: string,
    @CurrentUserId() userId: string,
  ) {
    return this.consentService.getAccessLogs(recordId, userId);
  }

  // Quick Actions
  @Post('grant-access/:doctorId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Grant access to a doctor (creates consent)' })
  @ApiParam({
    name: 'doctorId',
    description: 'Doctor ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Access granted successfully',
  })
  async grantAccess(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @CurrentUserId() userId: string,
    @Body() grantDto: GrantAccessDto,
  ) {
    // Create consent with immediate grant
    const createDto: CreateConsentDto = {
      doctorId,
      type: ConsentType.RECORD_ACCESS,
      permission: ConsentPermission.VIEW,
      description: grantDto.message,
      grantImmediately: true,
    };

    return this.consentService.createConsent(userId, createDto);
  }

  @Post('revoke-access/:doctorId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke access from a doctor' })
  @ApiParam({
    name: 'doctorId',
    description: 'Doctor ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @ApiResponse({
    status: 200,
    description: 'Access revoked successfully',
  })
  async revokeAccess(
    @Param('doctorId', ParseUUIDPipe) doctorId: string,
    @CurrentUserId() userId: string,
    @Body() revokeDto: RevokeAccessDto,
  ) {
    // Find and revoke active consent
    const consents = await this.consentService.getConsents(userId, userId);
    const activeConsent = consents.find(
      c => c.doctorId === doctorId && c.status === 'active'
    );

    if (!activeConsent) {
      throw new Error('No active consent found for this doctor');
    }

    const updateDto: UpdateConsentDto = {
      status: ConsentStatus.REVOKED,
      description: revokeDto.reason,
    };

    return this.consentService.updateConsent(activeConsent.id, updateDto, userId);
  }
}