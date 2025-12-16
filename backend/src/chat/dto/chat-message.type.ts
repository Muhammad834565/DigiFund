import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ChatMessageType {
  @Field(() => ID)
  id: string;

  @Field()
  roomId: string;

  @Field()
  senderId: string;

  @Field({ nullable: true })
  receiverId?: string;

  @Field()
  message: string;

  @Field()
  createdAt: Date;
}
