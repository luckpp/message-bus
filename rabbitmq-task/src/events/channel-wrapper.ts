import { ConfirmChannel } from "amqplib";

export class ChannelWrapper {
  private _channel: ConfirmChannel;

  constructor(channel: ConfirmChannel) {
    this._channel = channel;
  }

  public get channel(): ConfirmChannel {
    return this._channel;
  }
}
