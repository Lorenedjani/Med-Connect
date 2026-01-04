import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ITokenPair, IJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { EncryptionUtil } from '../../common/utils/encryption.util';
import { UserRole } from '../../common/constants/roles.constant';

@Injectable()
export class AuthService {
  private otpStore = new Map<string, { otp: string; expiresAt: Date }>();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string; user: Partial<User> }> {
    const { email, password, role, ...userData } = registerDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await EncryptionUtil.hashPassword(password);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
      isEmailVerified: false,
      ...userData,
    });

    await this.userRepository.save(user);

    // Generate and send OTP for email verification
    await this.generateAndSendOTP(email);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'User registered successfully. Please verify your email with the OTP sent.',
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<ITokenPair> {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    return this.generateTokenPair(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'isEmailVerified', 'status'],
    });

    if (!user || !(await EncryptionUtil.comparePassword(password, user.password))) {
      return null;
    }

    return user;
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    const { email, otp } = verifyOtpDto;

    const storedOtpData = this.otpStore.get(email);

    if (!storedOtpData) {
      throw new BadRequestException('OTP not found or expired');
    }

    if (new Date() > storedOtpData.expiresAt) {
      this.otpStore.delete(email);
      throw new BadRequestException('OTP has expired');
    }

    if (storedOtpData.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    // Mark user as verified
    await this.userRepository.update(
      { email },
      { isEmailVerified: true }
    );

    // Remove OTP from store
    this.otpStore.delete(email);

    return { message: 'Email verified successfully' };
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    await this.generateAndSendOTP(email);

    return { message: 'OTP sent successfully' };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await EncryptionUtil.comparePassword(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await EncryptionUtil.hashPassword(newPassword);

    // Update password
    await this.userRepository.update(userId, { password: hashedNewPassword });

    return { message: 'Password changed successfully' };
  }

  async refreshToken(refreshToken: string): Promise<ITokenPair> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      }) as IJwtPayload;

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        select: ['id', 'email', 'role', 'isEmailVerified', 'status'],
      });

      if (!user || !user.isEmailVerified) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokenPair(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async initiatePasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if email exists or not
      return { message: 'If an account with this email exists, a reset link has been sent' };
    }

    // Generate reset token and send email
    const resetToken = EncryptionUtil.generateSecureToken();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store reset token (in a real app, you'd store this in the database)
    // For now, we'll just simulate sending an email

    return { message: 'If an account with this email exists, a reset link has been sent' };
  }

  private generateTokenPair(user: User): ITokenPair {
    const payload: IJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id, tokenId: EncryptionUtil.generateSecureToken() },
      {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      },
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: parseInt(this.configService.get('jwt.expiresIn').replace(/\D/g, ''), 10),
    };
  }

  private async generateAndSendOTP(email: string): Promise<void> {
    const otp = EncryptionUtil.generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP
    this.otpStore.set(email, { otp, expiresAt });

    // In a real application, you would send this via email/SMS
    console.log(`OTP for ${email}: ${otp}`);

    // TODO: Integrate with email service
  }
}
