import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { DigiOtp, OtpPurpose } from '../../entities/digi-otp.entity';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(DigiOtp)
    private otpRepository: Repository<DigiOtp>,
  ) {}

  /**
   * Generate a 6-digit OTP
   */
  generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create and save OTP with 3-minute expiry
   */
  async createOtp(
    email: string,
    purpose: OtpPurpose,
    phone_no?: string,
  ): Promise<{ otp: string; otpRecord: DigiOtp }> {
    // Check daily limit (5 OTPs per day per email)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyCount = await this.otpRepository.count({
      where: {
        email,
        created_at: MoreThan(today),
      },
    });

    if (dailyCount >= 5) {
      throw new Error(
        'Daily OTP limit reached. Please try again tomorrow or contact support.',
      );
    }

    // Find existing active OTP for this email and purpose
    const existingOtp = await this.otpRepository.findOne({
      where: { email, purpose, is_active: true },
      order: { created_at: 'DESC' },
    });

    // Generate new OTP
    const otpCode = this.generateOtpCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 3); // 3 minutes expiry

    let otpRecord: DigiOtp;

    if (existingOtp) {
      // UPDATE existing record instead of creating new one
      existingOtp.otp = otpCode;
      existingOtp.expires_at = expiresAt;
      existingOtp.attempts = 0; // Reset attempts
      existingOtp.is_verified = false;
      if (phone_no) existingOtp.phone_no = phone_no;

      otpRecord = await this.otpRepository.save(existingOtp);
    } else {
      // Create new record only if none exists
      otpRecord = this.otpRepository.create({
        email,
        phone_no,
        otp: otpCode,
        purpose,
        expires_at: expiresAt,
        attempts: 0,
        max_attempts: 5,
        is_active: true,
        is_verified: false,
      });

      await this.otpRepository.save(otpRecord);
    }

    return { otp: otpCode, otpRecord };
  }

  /**
   * Verify OTP
   */
  async verifyOtp(
    email: string,
    otpCode: string,
    purpose: OtpPurpose,
  ): Promise<{ success: boolean; message: string; otpRecord?: DigiOtp }> {
    // Find active OTP
    const otpRecord = await this.otpRepository.findOne({
      where: {
        email,
        purpose,
        is_active: true,
      },
      order: {
        created_at: 'DESC',
      },
    });

    if (!otpRecord) {
      return {
        success: false,
        message: 'No active OTP found. Please request a new one.',
      };
    }

    // Check if expired
    if (new Date() > otpRecord.expires_at) {
      // Delete expired OTP from table
      await this.otpRepository.remove(otpRecord);
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.',
      };
    }

    // Check max attempts
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      // Delete OTP that exceeded max attempts
      await this.otpRepository.remove(otpRecord);
      return {
        success: false,
        message: 'Maximum attempts exceeded. Please request a new OTP.',
      };
    }

    // Verify OTP
    if (otpRecord.otp !== otpCode) {
      otpRecord.attempts += 1;
      await this.otpRepository.save(otpRecord);

      const attemptsLeft = otpRecord.max_attempts - otpRecord.attempts;
      return {
        success: false,
        message: `Invalid OTP. ${attemptsLeft} attempts remaining.`,
      };
    }

    // OTP is valid - Delete from table
    await this.otpRepository.remove(otpRecord);

    return {
      success: true,
      message: 'OTP verified successfully.',
      otpRecord,
    };
  }

  /**
   * Cleanup expired OTPs (can be run as a cron job)
   * Removes all expired and inactive OTPs from the database
   */
  async cleanupExpiredOtps(): Promise<number> {
    const result = await this.otpRepository.delete({
      expires_at: LessThan(new Date()),
    });

    return result.affected || 0;
  }

  /**
   * Get OTP count for today for an email
   */
  async getTodayOtpCount(email: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.otpRepository.count({
      where: {
        email,
        created_at: MoreThan(today),
      },
    });
  }
}
