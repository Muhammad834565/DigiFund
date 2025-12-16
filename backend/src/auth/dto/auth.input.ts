import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

@InputType()
export class LoginInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  password: string;
}

@InputType()
export class SignupInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company_name?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  contact_person: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  phone_no: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type_of_business?: string;

  @Field()
  @IsNotEmpty()
  @IsEnum([
    'guest_user',
    'supplier',
    'consumer',
    'inventory_manager',
    'financial_manager',
    'student',
    'business_owner',
  ])
  role: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

@InputType()
export class VerifyOtpInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(['signup', 'forgot_password'])
  purpose: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

@InputType()
export class ResendOtpInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(['signup', 'forgot_password'])
  purpose: string;
}

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  otp: string;

  @Field()
  @IsNotEmpty()
  @MinLength(8)
  new_password: string;
}

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  company_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contact_person?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone_no?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  gender?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  type_of_business?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;
}
