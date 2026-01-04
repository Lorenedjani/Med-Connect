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
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUserId } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants/roles.constant';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { IPaginatedResponse } from '../../common/interfaces/pagination.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserProfileDto> {
    return this.usersService.createUser(createUserDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  async getCurrentUserProfile(@CurrentUserId() userId: string): Promise<UserProfileDto> {
    return this.usersService.getUserProfile(userId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiParam({
    name: 'id',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async getUserProfile(@Param('id') userId: string): Promise<UserProfileDto> {
    return this.usersService.getUserProfile(userId);
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    type: UserProfileDto,
  })
  async updateUserProfile(
    @CurrentUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileDto> {
    return this.usersService.updateUserProfile(userId, updateUserDto);
  }

  @Put('patient-profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update patient profile' })
  @ApiResponse({
    status: 200,
    description: 'Patient profile updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - not a patient',
  })
  async updatePatientProfile(
    @CurrentUserId() userId: string,
    @Body() updatePatientDto: UpdatePatientProfileDto,
  ): Promise<UserProfileDto> {
    return this.usersService.updatePatientProfile(userId, updatePatientDto);
  }

  @Put('doctor-profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update doctor profile' })
  @ApiResponse({
    status: 200,
    description: 'Doctor profile updated successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Access denied - not a doctor',
  })
  async updateDoctorProfile(
    @CurrentUserId() userId: string,
    @Body() updateDoctorDto: UpdateDoctorProfileDto,
  ): Promise<UserProfileDto> {
    return this.usersService.updateDoctorProfile(userId, updateDoctorDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Search users' })
  @ApiPaginatedResponse(UserProfileDto)
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async searchUsers(@Query() query: SearchUsersDto): Promise<IPaginatedResponse<UserProfileDto>> {
    return this.usersService.searchUsers(query);
  }

  @Get('doctors/nearby')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Find nearby doctors' })
  @ApiQuery({
    name: 'latitude',
    description: 'User latitude',
    example: 40.7128,
    type: Number,
  })
  @ApiQuery({
    name: 'longitude',
    description: 'User longitude',
    example: -74.0060,
    type: Number,
  })
  @ApiQuery({
    name: 'radius',
    description: 'Search radius in kilometers',
    example: 50,
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'specialty',
    description: 'Filter by specialty',
    example: 'Cardiology',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Nearby doctors retrieved successfully',
    type: [UserProfileDto],
  })
  async findNearbyDoctors(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius?: number,
    @Query('specialty') specialty?: string,
  ): Promise<UserProfileDto[]> {
    return this.usersService.findNearbyDoctors(
      parseFloat(latitude.toString()),
      parseFloat(longitude.toString()),
      radius ? parseFloat(radius.toString()) : undefined,
      specialty,
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiParam({
    name: 'id',
    description: 'User ID to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') userId: string): Promise<void> {
    return this.usersService.deleteUser(userId);
  }

  @Get('admin/stats')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user statistics (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
  })
  async getUserStats() {
    return this.usersService.getUserStats();
  }
}
