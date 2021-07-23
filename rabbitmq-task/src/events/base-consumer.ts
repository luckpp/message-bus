import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import PubSub from 'pubsub-js';
import { ConnectionPool } from './connection-pool';
import { Message } from './message';
import { MessageWrapper } from './message-wrapper';

export abstract class BaseConsumer<T extends Message> {
  protected abstract _queueName: T['queueName'];
  protected abstract _messageType: T['type'];

  private _connectionPool: ConnectionPool;
  private _subscriptionToken: string | null;

  constructor(connectionPool: ConnectionPool) {
    this._connectionPool = connectionPool;
    this._subscriptionToken = null;
  }

  public async startConsume(): Promise<void> {
    if (!this._subscriptionToken) {
      const topic = `${this._queueName}.${this._messageType}`;
      this._subscriptionToken = PubSub.subscribe(
        topic,
        (topic: string, messageWrapper: MessageWrapper) => {
          this.handleMessage(topic, messageWrapper);
        }
      );
      await this._connectionPool.startConsume(this._queueName);
    }
  }

  public stop(): void {
    if (this._subscriptionToken) {
      PubSub.unsubscribe(this._subscriptionToken);
      this._subscriptionToken = null;
    }
  }

  private handleMessage(topic: string, messageWrapper: MessageWrapper): void {
    const { message, channel, channelMessage } = messageWrapper;

    console.log('received: ', topic, message);

    if (channel && channelMessage) {
      try {
        channel.ack(channelMessage);
      } catch (err) {
        console.error('can not ack', message);
      }
    }
  }

  private consumeInternal(
    consumeMessage: ConsumeMessage | null,
    channel: ConfirmChannel
  ) {
    if (consumeMessage) {
      const content = consumeMessage.content.toString();
      const contentJson = JSON.parse(content) as Message;
      console.log(` [x] Received ${content}`);
      if (contentJson.type == this._messageType) {
        console.log(`  [x] Done ${contentJson}`);
        channel.ack(consumeMessage);
      } else {
        channel.nack(consumeMessage);
      }
      // setTimeout(() => {
      //   console.log(`[${this.id}][x] Done`);
      //   // channel.ack(consumeMessage);
      //   channel.nack(consumeMessage);
      // }, contentJson.payload.delay * 1000);
    } else {
      console.error('null message');
    }
  }
}
