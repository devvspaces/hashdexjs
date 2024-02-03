import { ApiResponseProperty } from '@nestjs/swagger';

export class MessagePresenter {
  @ApiResponseProperty()
  message: string;

  constructor(data: Partial<MessagePresenter>) {
    Object.assign(this, data);
  }
}
