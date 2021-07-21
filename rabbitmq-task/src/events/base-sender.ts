import { BusWrapper } from "./bus-wrapper";
import { Message } from "./message";

export abstract class BaseSender<T extends Message> {
  protected abstract _queueName: T["queueName"];
  private _busWrapper: BusWrapper;

  constructor(busWrapper: BusWrapper) {
    this._busWrapper = busWrapper;
  }

  public send(type: T["type"], payload: T["payload"]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const channel = await this._busWrapper.getChannel(this._queueName);
      const message = JSON.stringify({ type, payload });
      const result = await channel.sendToQueue(
        this._queueName,
        Buffer.from(message),
        { persistent: true },
        (err, ok) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
      console.log(`Sent message [${message}]`);
    });
  }
}
