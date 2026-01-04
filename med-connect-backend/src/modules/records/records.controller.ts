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
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { RecordsService } from './records.service';
import { UploadRecordDto } from './dto/upload-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { FilterRecordsDto } from './dto/filter-records.dto';
import { RecordMetadataDto, RecordListItemDto } from './dto/record-metadata.dto';
import { ShareRecordDto, RevokeShareDto } from './dto/share-record.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUserId, CurrentUserRole } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants/roles.constant';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { IPaginatedResponse } from '../../common/interfaces/pagination.interface';

@ApiTags('records')
@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post('upload/initiate')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate file upload for medical record' })
  @ApiResponse({
    status: 200,
    description: 'Upload initiated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  async initiateUpload(
    @Body() uploadDto: UploadRecordDto,
    @CurrentUserId() userId: string,
  ) {
    // For patient uploads, patientId is the userId
    // For doctor uploads on behalf of patients, this would need different logic
    return this.recordsService.initiateUpload(uploadDto, userId, userId);
  }

  @Post('upload/complete/:recordId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete file upload for medical record' })
  @ApiParam({
    name: 'recordId',
    description: 'Record ID from initiate upload',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Record uploaded successfully',
    type: RecordMetadataDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Upload session not found',
  })
  async completeUpload(
    @Param('recordId', ParseUUIDPipe) recordId: string,
    @Body() fileData: {
      fileName: string;
      originalFileName: string;
      mimeType: string;
      fileSize: number;
      fileUrl: string;
      fileKey?: string;
    },
    @CurrentUserId() userId: string,
  ) {
    return this.recordsService.completeUpload(recordId, userId, userId, fileData);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get medical records' })
  @ApiPaginatedResponse(RecordListItemDto)
  @ApiResponse({
    status: 200,
    description: 'Records retrieved successfully',
  })
  async getRecords(
    @Query() filters: FilterRecordsDto,
    @CurrentUserId() userId: string,
    @CurrentUserRole() userRole: UserRole,
  ): Promise<IPaginatedResponse<RecordListItemDto>> {
    // If no patientId specified, assume user wants their own records
    const patientId = filters['patientId'] || userId;
    return this.recordsService.getRecords(patientId, filters, userId, userRole);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get medical record by ID' })
  @ApiParam({
    name: 'id',
    description: 'Medical record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Record retrieved successfully',
    type: RecordMetadataDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  async getRecord(
    @Param('id', ParseUUIDPipe) recordId: string,
    @CurrentUserId() userId: string,
    @CurrentUserRole() userRole: UserRole,
  ): Promise<RecordMetadataDto> {
    return this.recordsService.getRecord(recordId, userId, userRole);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update medical record' })
  @ApiParam({
    name: 'id',
    description: 'Medical record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Record updated successfully',
    type: RecordMetadataDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  async updateRecord(
    @Param('id', ParseUUIDPipe) recordId: string,
    @Body() updateDto: UpdateRecordDto,
    @CurrentUserId() userId: string,
    @CurrentUserRole() userRole: UserRole,
  ): Promise<RecordMetadataDto> {
    return this.recordsService.updateRecord(recordId, updateDto, userId, userRole);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete medical record' })
  @ApiParam({
    name: 'id',
    description: 'Medical record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Record deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
  })
  async deleteRecord(
    @Param('id', ParseUUIDPipe) recordId: string,
    @CurrentUserId() userId: string,
    @CurrentUserRole() userRole: UserRole,
  ): Promise<void> {
    return this.recordsService.deleteRecord(recordId, userId, userRole);
  }

  @Post(':id/share')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Share medical record with another user' })
  @ApiParam({
    name: 'id',
    description: 'Medical record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Record shared successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - only record owner can share',
  })
  async shareRecord(
    @Param('id', ParseUUIDPipe) recordId: string,
    @Body() shareDto: ShareRecordDto,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    return this.recordsService.shareRecord(recordId, shareDto, userId);
  }

  @Post(':id/revoke-share')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoke record sharing' })
  @ApiParam({
    name: 'id',
    description: 'Medical record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Share revoked successfully',
  })
  async revokeShare(
    @Param('id', ParseUUIDPipe) recordId: string,
    @Body() revokeDto: RevokeShareDto,
    @CurrentUserId() userId: string,
  ): Promise<void> {
    // TODO: Implement revoke share functionality
    return Promise.resolve();
  }

  @Get(':id/download')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get download URL for medical record' })
  @ApiParam({
    name: 'id',
    description: 'Medical record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Download URL generated successfully',
  })
  async getDownloadUrl(
    @Param('id', ParseUUIDPipe) recordId: string,
    @CurrentUserId() userId: string,
    @CurrentUserRole() userRole: UserRole,
  ): Promise<{ downloadUrl: string }> {
    const downloadUrl = await this.recordsService.getDownloadUrl(recordId, userId, userRole);
    return { downloadUrl };
  }

  @Get('categories/stats')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get record statistics by category' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getCategoryStats(@CurrentUserId() userId: string) {
    // TODO: Implement category statistics
    return { message: 'Category stats functionality not yet implemented' };
  }

  @Get('storage/usage')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get storage usage statistics' })
  @ApiResponse({
    status: 200,
    description: 'Storage usage retrieved successfully',
  })
  async getStorageUsage(@CurrentUserId() userId: string) {
    // TODO: Implement storage usage statistics
    return { message: 'Storage usage functionality not yet implemented' };
  }
}