import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserMain } from '../entities/user-main.entity';
import { LoginToken } from '../entities/login-token.entity';
import { DigiOtp, OtpPurpose } from '../entities/digi-otp.entity';
import { ActivityLog, ActivityType } from '../entities/activity-log.entity';
import { OtpService } from '../common/services/otp.service';
import { EmailService } from '../common/services/email.service';
import {
  generatePublicId,
  generatePrivateId,
} from '../common/utils/id-generator.util';
import {
  LoginInput,
  SignupInput,
  VerifyOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from './dto/auth.input';
import { LoginResponse } from './dto/auth.response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserMain)
    private userRepository: Repository<UserMain>,
    @InjectRepository(LoginToken)
    private loginTokenRepository: Repository<LoginToken>,
    @InjectRepository(DigiOtp)
    private otpRepository: Repository<DigiOtp>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    private jwtService: JwtService,
    private otpService: OtpService,
    private emailService: EmailService,
  ) {}

  /**
   * Login with email or phone number
   */
  async login(loginInput: LoginInput): Promise<LoginResponse> {
    // Validate that at least email or phone is provided
    if (!loginInput.email && !loginInput.phone_no) {
      throw new BadRequestException('Email or phone number is required');
    }

    // Find user by email or phone
    const whereCondition = loginInput.email
      ? { email: loginInput.email }
      : { phone_no: loginInput.phone_no };

    const user = await this.userRepository.findOne({ where: whereCondition });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is verified
    if (!user.is_verified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = {
      sub: user.id,
      public_id: user.public_id,
      private_id: user.private_id,
      email: user.email,
      role: user.role,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Save token in login_tokens table
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const loginToken = this.loginTokenRepository.create({
      user_id: user.id,
      public_id: user.public_id,
      private_id: user.private_id,
      token,
      expires_at: expiresAt,
      is_active: true,
    });

    await this.loginTokenRepository.save(loginToken);

    // Log activity
    await this.logActivity(
      user.public_id,
      ActivityType.USER_LOGIN,
      `User logged in`,
    );

    // Return response
    return {
      token,
      company_name: user.company_name || user.contact_person,
      public_id: user.public_id,
      private_id: user.private_id,
      contact_person: user.contact_person,
      email: user.email,
      phone_no: user.phone_no,
      address: user.address,
      status: user.status,
      gender: user.gender,
      type_of_business: user.type_of_business,
      role: user.role,
    };
  }

  /**
   * Signup - Create user and send OTP
   */
  async signup(
    signupInput: SignupInput,
  ): Promise<{ message: string; email: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email: signupInput.email }, { phone_no: signupInput.phone_no }],
    });

    if (existingUser) {
      throw new ConflictException(
        'User with this email or phone already exists',
      );
    }

    // Generate unique IDs
    const publicId = await generatePublicId(
      signupInput.role,
      this.userRepository,
    );
    const privateId = await generatePrivateId(this.userRepository);

    // Hash password
    const hashedPassword = await bcrypt.hash(signupInput.password, 10);

    // Generate OTP first (before saving user)
    const { otp } = await this.otpService.createOtp(
      signupInput.email,
      OtpPurpose.SIGNUP,
      signupInput.phone_no,
    );

    // Send email first - if this fails, user won't be created
    await this.emailService.sendOtpEmail(signupInput.email, otp, 'signup');

    // Only create user AFTER email is successfully sent
    const user = this.userRepository.create({
      public_id: publicId,
      private_id: privateId,
      company_name: signupInput.company_name,
      contact_person: signupInput.contact_person,
      email: signupInput.email,
      phone_no: signupInput.phone_no,
      address: signupInput.address,
      gender: signupInput.gender,
      type_of_business: signupInput.type_of_business,
      role: signupInput.role,
      password: hashedPassword,
      is_verified: false,
      status: 'pending',
    });

    await this.userRepository.save(user);

    return {
      message:
        'Signup successful. Please check your email for OTP verification.',
      email: signupInput.email,
    };
  }

  /**
   * Verify OTP
   */
  async verifyOtp(
    verifyOtpInput: VerifyOtpInput,
  ): Promise<{ message: string; success: boolean; user?: UserMain }> {
    const result = await this.otpService.verifyOtp(
      verifyOtpInput.email,
      verifyOtpInput.otp,
      verifyOtpInput.purpose as OtpPurpose,
    );

    if (!result.success) {
      return { message: result.message, success: false };
    }

    // If signup OTP, mark user as verified
    if (verifyOtpInput.purpose === 'signup') {
      const user = await this.userRepository.findOne({
        where: { email: verifyOtpInput.email },
      });

      if (user) {
        user.is_verified = true;
        user.status = 'active';
        await this.userRepository.save(user);

        // Log activity
        await this.logActivity(
          user.public_id,
          ActivityType.USER_SIGNUP,
          `User account verified`,
        );

        // Send welcome email
        await this.emailService.sendWelcomeEmail(
          user.email,
          user.contact_person,
        );

        return {
          message: 'Email verified successfully. You can now login.',
          success: true,
          user,
        };
      }
    }

    return { message: result.message, success: true };
  }

  /**
   * Forgot Password - Send OTP
   */
  async forgotPassword(
    forgotPasswordInput: ForgotPasswordInput,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: { email: forgotPasswordInput.email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        message:
          'If your email exists in our system, you will receive a password reset OTP.',
      };
    }

    // Generate and send OTP
    const { otp } = await this.otpService.createOtp(
      forgotPasswordInput.email,
      OtpPurpose.FORGOT_PASSWORD,
    );

    await this.emailService.sendOtpEmail(
      forgotPasswordInput.email,
      otp,
      'forgot_password',
    );

    return { message: 'Password reset OTP sent to your email.' };
  }

  /**
   * Resend OTP
   */
  async resendOtp(
    email: string,
    purpose: OtpPurpose,
  ): Promise<{ message: string }> {
    // Generate and send new OTP
    const { otp } = await this.otpService.createOtp(email, purpose);

    const purposeText =
      purpose === OtpPurpose.SIGNUP ? 'signup' : 'forgot_password';
    await this.emailService.sendOtpEmail(email, otp, purposeText);

    return { message: 'New OTP sent to your email.' };
  }

  /**
   * Reset Password
   */
  async resetPassword(
    resetPasswordInput: ResetPasswordInput,
  ): Promise<{ message: string }> {
    // Verify OTP first
    const otpResult = await this.otpService.verifyOtp(
      resetPasswordInput.email,
      resetPasswordInput.otp,
      OtpPurpose.FORGOT_PASSWORD,
    );

    if (!otpResult.success) {
      throw new BadRequestException(otpResult.message);
    }

    // Find user and update password
    const user = await this.userRepository.findOne({
      where: { email: resetPasswordInput.email },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Hash new password
    user.password = await bcrypt.hash(resetPasswordInput.new_password, 10);
    await this.userRepository.save(user);

    // Invalidate all existing tokens
    await this.loginTokenRepository.update(
      { user_id: user.id },
      { is_active: false },
    );

    return {
      message:
        'Password reset successful. Please login with your new password.',
    };
  }

  /**
   * Logout
   */
  async logout(token: string): Promise<{ message: string }> {
    if (!token) {
      throw new BadRequestException('Token is required for logout');
    }

    // Find the token record
    const tokenRecord = await this.loginTokenRepository.findOne({
      where: { token, is_active: true },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or already logged out token');
    }

    // Invalidate the token
    tokenRecord.is_active = false;
    await this.loginTokenRepository.save(tokenRecord);

    // Log activity
    await this.logActivity(
      tokenRecord.public_id,
      ActivityType.USER_LOGOUT,
      'User logged out',
    );

    return { message: 'Logged out successfully' };
  }

  /**
   * Update User Profile
   */
  async updateProfile(
    publicId: string,
    updateInput: UpdateProfileInput,
  ): Promise<UserMain> {
    const user = await this.userRepository.findOne({
      where: { public_id: publicId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    Object.assign(user, updateInput);
    return await this.userRepository.save(user);
  }

  /**
   * Get User by Public ID
   */
  async getUserByPublicId(publicId: string): Promise<UserMain> {
    const user = await this.userRepository.findOne({
      where: { public_id: publicId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  /**
   * Validate Token
   */
  async validateToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);

      // Check if token exists in database and is active
      const loginToken = await this.loginTokenRepository.findOne({
        where: { token, is_active: true },
      });

      if (!loginToken) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Log Activity
   */
  private async logActivity(
    userPublicId: string,
    activityType: ActivityType,
    description: string,
    metadata?: any,
  ): Promise<void> {
    const activity = this.activityLogRepository.create({
      user_public_id: userPublicId,
      activity_type: activityType,
      description,
      metadata,
    });

    await this.activityLogRepository.save(activity);
  }
}
