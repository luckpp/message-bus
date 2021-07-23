import { BusWrapper } from './bus-wrapper';
import { Message } from './message';
import { MessageTypes } from './message-types';
import { QueueNames } from './queue-names';

export abstract class BaseSender<T extends Message> {
  protected abstract _queueName: T['queueName'];
  protected abstract _messageType: T['type'];

  private _busWrapper: BusWrapper;

  constructor(busWrapper: BusWrapper) {
    this._busWrapper = busWrapper;
  }

  public send(payload: T['payload']): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const channel = await this._busWrapper.getSendChannel(this._queueName);
        if (!channel) {
          return reject(
            new Error(`Can not create channel for queue [${this._queueName}]`)
          );
        }
        const message = JSON.stringify({ type: this._messageType, payload });
        await channel.sendToQueue(
          this._queueName,
          Buffer.from(message),
          { persistent: true },
          (err, ok) => {
            if (err) {
              return reject(err);
            } else {
              return resolve();
            }
          }
        );
      } catch (err) {
        return reject(err);
      }
    });
  }
}
