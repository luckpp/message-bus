import { BusWrapper } from './bus-wrapper';
import { Message } from './message';
import { QueueNames } from './queue-names';

export class ConnectionPool {
  private _busWrapper: BusWrapper;
  private _consumeQueues: string[];

  constructor(busWrapper: BusWrapper) {
    this._busWrapper = busWrapper;
    this._consumeQueues = [];
  }

  public async listenToQueue(queueName: QueueNames): Promise<void> {
    const existingQueue = this._consumeQueues.find((qn) => qn == queueName);
    if (!existingQueue) {
      const channel = await this._busWrapper.getConsumeChannel(queueName);
      this._consumeQueues.push(queueName);
      if (channel) {
        channel.consume(
          queueName,
          (consumeMessage) => {
            if (consumeMessage) {
              const content = consumeMessage.content.toString();
              console.log(` [x] Received ${content}`);
              const contentJson = JSON.parse(content) as Message;
              PubSub.publish(`${queueName}.${contentJson.type}`, content);
              channel.ack(consumeMessage);
            } else {
              console.error('+++++++++++++++++++++++++++');
            }
          },
          {
            noAck: false, // manual acknowledgment mode
          }
        );
      }
    }
  }
}
