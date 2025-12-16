import { Resolver, Query, Mutation, Subscription, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomType } from './dto/chat-room.type';
import { ChatMessageType } from './dto/chat-message.type';
import { CreateRoomInput } from './dto/create-room.input';
import { SendMessageInput } from './dto/send-message.input';
import { JoinRoomInput } from './dto/join-room.input';
import { PubSub } from 'graphql-subscriptions';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const pubSub = new PubSub();

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) { }

  @Mutation(() => ChatRoomType)
  @UseGuards(JwtAuthGuard)
  async createChatRoom(@Args('input') input: CreateRoomInput, @Context() context) {
    const userPublicId = context.req.user.public_id;
    return this.chatService.createRoom(input, userPublicId);
  }

  @Mutation(() => ChatRoomType)
  @UseGuards(JwtAuthGuard)
  async joinChatRoom(@Args('input') input: JoinRoomInput, @Context() context) {
    const userPublicId = context.req.user.public_id;
    const room = await this.chatService.joinRoom(input.roomId, userPublicId);

    // Publish join event
    void pubSub.publish('userJoinedRoom', {
      userJoinedRoom: {
        roomId: input.roomId,
        userId: userPublicId,
      },
    });

    return room;
  }

  @Mutation(() => ChatMessageType)
  @UseGuards(JwtAuthGuard)
  async sendChatMessage(@Args('input') input: SendMessageInput, @Context() context) {
    const userPublicId = context.req.user.public_id;
    const message = await this.chatService.sendMessage(input, userPublicId);

    // Publish message to subscribers
    void pubSub.publish(`messageToRoom_${input.roomId}`, {
      messageReceived: message,
    });

    return message;
  }

  @Query(() => [ChatMessageType])
  @UseGuards(JwtAuthGuard)
  async chatRoomMessages(@Args('roomId') roomId: string, @Context() context) {
    const userPublicId = context.req.user.public_id;
    return this.chatService.getRoomMessages(roomId, userPublicId);
  }

  @Query(() => [ChatRoomType])
  @UseGuards(JwtAuthGuard)
  async userChatRooms(@Context() context) {
    const userPublicId = context.req.user.public_id;
    return this.chatService.getUserRooms(userPublicId);
  }

  @Mutation(() => ChatRoomType)
  @UseGuards(JwtAuthGuard)
  async getOrCreatePrivateChatRoom(
    @Args('receiverId') receiverId: string,
    @Context() context,
  ) {
    const userPublicId = context.req.user.public_id;
    return this.chatService.getOrCreatePrivateRoom(userPublicId, receiverId);
  }

  @Subscription(() => ChatMessageType, {
    filter: (payload: any, variables: any) => {
      return payload.messageReceived.roomId === variables.roomId;
    },
  })
  @UseGuards(JwtAuthGuard)
  messageReceived(@Args('roomId') roomId: string) {
    return pubSub.asyncIterableIterator(`messageToRoom_${roomId}`);
  }

  @Subscription(() => UserJoinedRoomType)
  @UseGuards(JwtAuthGuard)
  userJoinedRoom() {
    return pubSub.asyncIterableIterator('userJoinedRoom');
  }
}

// Additional type for user joined event
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class UserJoinedRoomType {
  @Field()
  roomId: string;

  @Field()
  userId: string;
}
