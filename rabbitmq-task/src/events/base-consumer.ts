import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import PubSub from 'pubsub-js';
import { BusWrapper } from './bus-wrapper';
import { ConnectionPool } from './connection-pool';
import { Message } from './message';

export abstract class BaseConsumer<T extends Message> {
  protected abstract _queueName: T['queueName'];
  protected abstract _messageType: T['type'];

  private _connectionPool: ConnectionPool;
  private _subscriptionToken: string | null;

  constructor(connectionPool: ConnectionPool) {
    this._connectionPool = connectionPool;
    this._subscriptionToken = null;
  }

  public async consume(): Promise<void> {
    if (!this._subscriptionToken) {
      const topic = `${this._queueName}.${this._messageType}`;
      this._subscriptionToken = PubSub.subscribe(
        topic,
        (topic: string, data: any) => {
          console.log(topic, data);
        }
      );
      await this._connectionPool.listenToQueue(this._queueName);
    }
  }

  public stop(): void {
    if (this._subscriptionToken) {
      PubSub.unsubscribe(this._subscriptionToken);
      this._subscriptionToken = null;
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
