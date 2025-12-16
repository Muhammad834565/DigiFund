import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateRoomInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsOptional()
  participantIds?: string[];
}
