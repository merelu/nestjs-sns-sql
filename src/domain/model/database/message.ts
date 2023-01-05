import { MessageType } from '@domain/common/enums/message.enum';
import { PickType } from '@nestjs/mapped-types';
import { CoupleChannelModel } from './couple-channel';
import { UserModel } from './user';

export class MessageModel {
  id: number;
  type: MessageType;
  content: string;
  read: boolean;

  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;

  couple_channel_id: number | null;

  couple_channel: CoupleChannelModel;

  sender_id: number | null;

  sender: UserModel;
}

export class CreateMessageModel extends PickType(MessageModel, [
  'type',
  'content',
  'sender_id',
  'couple_channel_id',
] as const) {}
