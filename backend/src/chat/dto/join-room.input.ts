import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class JoinRoomInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  roomId: string;
}
