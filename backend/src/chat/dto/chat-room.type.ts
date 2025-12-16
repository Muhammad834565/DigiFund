import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ChatRoomType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [String])
  participantIds: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
