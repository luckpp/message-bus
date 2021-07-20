import { Message } from "./message";
import { ChannelWrapper } from "./channel-wrapper";

export abstract class BaseSender<T extends Message> {
  protected abstract _queueName: T["queueName"];
  private _queueWrapper: ChannelWrapper;

  constructor(queueWrapper: ChannelWrapper) {
    this._queueWrapper = queueWrapper;
  }

  public sendAsync(type: T["type"], payload: T["payload"]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      console.log(this._queueName);
      const result = await this._queueWrapper.channel.sendToQueue(
        this._queueName,
        Buffer.from(JSON.stringify({ type, payload })),
        { persistent: true },
        (err, ok) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }
}
