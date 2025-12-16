import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { CreateRoomInput } from './dto/create-room.input';
import { SendMessageInput } from './dto/send-message.input';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) { }

  async createRoom(createRoomInput: CreateRoomInput, creatorPublicId: string): Promise<ChatRoom> {
    const participantIds = createRoomInput.participantIds || [];

    // Add creator to participants if not already included
    if (!participantIds.includes(creatorPublicId)) {
      participantIds.push(creatorPublicId);
    }

    const room = this.chatRoomRepository.create({
      name: createRoomInput.name,
      participantIds,
    });
    return this.chatRoomRepository.save(room);
  }

  async joinRoom(roomId: string, userId: string): Promise<ChatRoom> {
    const room = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Add user to participants if not already in the room
    if (!room.participantIds.includes(userId)) {
      room.participantIds.push(userId);
      await this.chatRoomRepository.save(room);
    }

    return room;
  }

  async sendMessage(sendMessageInput: SendMessageInput, senderPublicId: string): Promise<ChatMessage> {
    const room = await this.chatRoomRepository.findOne({
      where: { id: sendMessageInput.roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Verify sender is a participant in the room
    if (!room.participantIds.includes(senderPublicId)) {
      throw new ForbiddenException('You are not a participant in this room');
    }

    const message = this.chatMessageRepository.create({
      roomId: sendMessageInput.roomId,
      senderId: senderPublicId,
      receiverId: sendMessageInput.receiverId,
      message: sendMessageInput.message,
    });

    return this.chatMessageRepository.save(message);
  }

  async getRoomMessages(roomId: string, userPublicId: string): Promise<ChatMessage[]> {
    // Verify user has access to this room
    await this.verifyUserInRoom(roomId, userPublicId);

    return this.chatMessageRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
    });
  }

  async getUserRooms(userId: string): Promise<ChatRoom[]> {
    const rooms = await this.chatRoomRepository
      .createQueryBuilder('room')
      .where('room.participantIds @> ARRAY[:userId]', { userId })
      .getMany();

    return rooms;
  }

  async findRoomBetweenUsers(
    senderId: string,
    receiverId: string,
  ): Promise<ChatRoom | null> {
    const rooms = await this.chatRoomRepository
      .createQueryBuilder('room')
      .where('room.participantIds @> ARRAY[:senderId]', { senderId })
      .andWhere('room.participantIds @> ARRAY[:receiverId]', { receiverId })
      .getMany();

    // Find a room with exactly these two participants
    const exactRoom = rooms.find(
      (room) =>
        room.participantIds.length === 2 &&
        room.participantIds.includes(senderId) &&
        room.participantIds.includes(receiverId),
    );

    return exactRoom || null;
  }

  async getOrCreatePrivateRoom(
    senderId: string,
    receiverId: string,
  ): Promise<ChatRoom> {
    // Try to find existing room
    const existingRoom = await this.findRoomBetweenUsers(senderId, receiverId);

    if (existingRoom) {
      return existingRoom;
    }

    // Create new private room
    return this.createRoom({
      name: `Private: ${senderId}-${receiverId}`,
      participantIds: [senderId, receiverId],
    }, senderId);
  }

  /**
   * Verify that a user is a participant in a room
   * @throws NotFoundException if room doesn't exist
   * @throws ForbiddenException if user is not a participant
   */
  async verifyUserInRoom(roomId: string, userPublicId: string): Promise<void> {
    const room = await this.chatRoomRepository.findOne({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (!room.participantIds.includes(userPublicId)) {
      throw new ForbiddenException('You do not have access to this room');
    }
  }
}
