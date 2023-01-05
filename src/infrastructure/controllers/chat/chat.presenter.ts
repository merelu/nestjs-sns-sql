import { MessageType } from '@domain/common/enums/message.enum';
import { MessageModel } from '@domain/model/database/message';
import { ApiProperty } from '@nestjs/swagger';
import { SimpleUserPresenter } from '../user/user.presenter';

export class BaseChatPresenter {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: MessageType;

  @ApiProperty()
  content: string;

  @ApiProperty()
  read: boolean;

  @ApiProperty({ type: SimpleUserPresenter, nullable: true })
  sender: SimpleUserPresenter | null;

  constructor(data: MessageModel) {
    this.id = data.id;
    this.type = data.type;
    this.content = data.content;
    this.read = data.read;
    this.sender = data.sender ? new SimpleUserPresenter(data.sender) : null;
  }
}
