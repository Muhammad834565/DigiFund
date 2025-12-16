import { ObjectType, Field } from '@nestjs/graphql';
import { UserMain } from '../../entities/user-main.entity';

@ObjectType()
export class LoginResponse {
  @Field()
  token: string;

  @Field()
  company_name: string;

  @Field()
  public_id: string;

  @Field()
  private_id: string;

  @Field()
  contact_person: string;

  @Field()
  email: string;

  @Field()
  phone_no: string;

  @Field({ nullable: true })
  address?: string;

  @Field()
  status: string;

  @Field({ nullable: true })
  gender?: string;

  @Field({ nullable: true })
  type_of_business?: string;

  @Field()
  role: string;
}

@ObjectType()
export class SignupResponse {
  @Field()
  message: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  user?: UserMain;
}

@ObjectType()
export class OtpResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}
