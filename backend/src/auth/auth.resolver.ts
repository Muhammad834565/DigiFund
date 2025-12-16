import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  LoginInput,
  SignupInput,
  VerifyOtpInput,
  ForgotPasswordInput,
  ResendOtpInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from './dto/auth.input';
import {
  LoginResponse,
  SignupResponse,
  OtpResponse,
  LogoutResponse,
} from './dto/auth.response';
import { UserMain } from '../entities/user-main.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResponse, {
    description: 'Login with email or phone number and password',
  })
  async login(
    @Args('input') input: LoginInput,
    @Context() context: any,
  ): Promise<LoginResponse> {
    const response = await this.authService.login(input);

    // Set cookies
    if (context.res) {
      context.res.cookie('token', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      context.res.cookie('public_id', response.public_id, {
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      context.res.cookie('private_id', response.private_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return response;
  }

  @Mutation(() => SignupResponse, {
    description: 'Register a new user and send OTP for verification',
  })
  async signup(@Args('input') input: SignupInput): Promise<SignupResponse> {
    const result = await this.authService.signup(input);
    return {
      message: result.message,
      email: result.email,
    };
  }

  @Mutation(() => OtpResponse, {
    description: 'Verify OTP for signup or password reset',
  })
  async verifyOtp(@Args('input') input: VerifyOtpInput): Promise<OtpResponse> {
    const result = await this.authService.verifyOtp(input);
    return {
      message: result.message,
      success: result.success,
    };
  }

  @Mutation(() => OtpResponse, { description: 'Request password reset OTP' })
  async forgotPassword(
    @Args('input') input: ForgotPasswordInput,
  ): Promise<OtpResponse> {
    const result = await this.authService.forgotPassword(input);
    return {
      message: result.message,
      success: true,
    };
  }

  @Mutation(() => OtpResponse, {
    description: 'Resend OTP for signup or password reset',
  })
  async resendOtp(@Args('input') input: ResendOtpInput): Promise<OtpResponse> {
    const purpose = input.purpose as 'signup' | 'forgot_password';
    const result = await this.authService.resendOtp(
      input.email,
      purpose as any,
    );
    return {
      message: result.message,
      success: true,
    };
  }

  @Mutation(() => OtpResponse, { description: 'Reset password with OTP' })
  async resetPassword(
    @Args('input') input: ResetPasswordInput,
  ): Promise<OtpResponse> {
    const result = await this.authService.resetPassword(input);
    return {
      message: result.message,
      success: true,
    };
  }

  @Mutation(() => LogoutResponse, {
    description: 'Logout and invalidate token',
  })
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context: any): Promise<LogoutResponse> {
    const token = context.req.headers.authorization?.replace('Bearer ', '');
    const result = await this.authService.logout(token);

    // Clear cookies
    if (context.res) {
      context.res.clearCookie('token');
      context.res.clearCookie('public_id');
      context.res.clearCookie('private_id');
    }

    return {
      message: result.message,
      success: true,
    };
  }

  @Mutation(() => UserMain, { description: 'Update user profile' })
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Args('input') input: UpdateProfileInput,
    @Context() context: any,
  ): Promise<UserMain> {
    const user = context.req.user;
    return await this.authService.updateProfile(user.public_id, input);
  }

  @Query(() => UserMain, { description: 'Get current user profile' })
  @UseGuards(JwtAuthGuard)
  async me(@Context() context: any): Promise<UserMain> {
    const user = context.req.user;
    return await this.authService.getUserByPublicId(user.public_id);
  }

  @Query(() => UserMain, { description: 'Get user by public ID' })
  @UseGuards(JwtAuthGuard)
  async getUserByPublicId(
    @Args('public_id') publicId: string,
  ): Promise<UserMain> {
    return await this.authService.getUserByPublicId(publicId);
  }
}
