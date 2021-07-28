import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import PubSub from 'pubsub-js';
import { Util } from '../util/util';
import { BusWrapper } from './bus-wrapper';
import { Message } from './message';
import { MessageWrapper } from './message-wrapper';
import { QueueNames } from './queue-names';

export class ConnectionPool {
  private _busWrapper: BusWrapper;
  private _consumeQueues: QueueNames[];

  constructor(busWrapper: BusWrapper) {
    this._busWrapper = busWrapper;
    this._consumeQueues = [];
    setInterval(() => {
      this.checkHealth();
    }, 2000);
  }

  private async checkHealth(): Promise<void> {
    for (const queueName of this._consumeQueues) {
      try {
        const channel = await this._busWrapper.getConsumeChannel(queueName);
        if (channel) {
          console.log(`Checking queue: `, queueName);
          const result = await channel.checkQueue(queueName);
          console.log(result);
        }
      } catch (err) {
        console.log(`Unhealthy queue: `, queueName);
        await this.executeWithRetry(async () => {
          await this.startConsumeInternal(queueName);
        });
      }
    }
  }

  public async startConsume(queueName: QueueNames): Promise<void> {
    const existingQueue = this._consumeQueues.find((qn) => qn == queueName);
    if (!existingQueue) {
      await this.executeWithRetry(async () => {
        await this.startConsumeInternal(queueName);
      });
      this._consumeQueues.push(queueName);
    }
  }

  private async startConsumeInternal(queueName: QueueNames): Promise<void> {
    const channel = await this._busWrapper.getConsumeChannel(queueName);
    if (channel) {
      const { consumerTag } = await channel.consume(
        queueName,
        (channelMessage) => {
          this.messageHandler(queueName, channel, channelMessage);
        },
        {
          noAck: false, // manual acknowledgment mode
        }
      );
    }
  }

  private messageHandler(
    queueName: string,
    channel: ConfirmChannel,
    channelMessage: ConsumeMessage | null
  ): void {
    if (channelMessage) {
      const content = channelMessage.content.toString();
      const message = JSON.parse(content) as Message;

      // TODO: check if message has valid format -> if not drop it

      const topic = `${queueName}.${message.type}`;
      const messageWrapper: MessageWrapper = {
        message,
        channel,
        channelMessage,
      };
      PubSub.publish(topic, messageWrapper);
    } else {
      // TODO: redo connection for queueName
    }
  }

  private async executeWithRetry(
    operation: () => Promise<void>
  ): Promise<void> {
    let errorOccurred = false;
    do {
      try {
        await operation();
        errorOccurred = false;
      } catch (err) {
        console.error('Error occurred during operation');
        errorOccurred = true;
        await Util.Delay(1000);
      }
    } while (errorOccurred);
  }
}
