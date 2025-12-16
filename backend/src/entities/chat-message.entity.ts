import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('chat_messages')
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomId: string;

  @Column()
  senderId: string; // Stores user's public_id

  @Column({ nullable: true })
  receiverId: string; // Stores user's public_id

  @Column('text')
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
