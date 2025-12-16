import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  receiverId?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;
}
