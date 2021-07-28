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
        async (topic: string, messageWrapper: MessageWrapper) => {
          await this.handleMessage(topic, messageWrapper);
        }
      );
      await this._connectionPool.startConsume(this._queueName);
    }
  }

  public abstract onMessage(message: T): Promise<void>;

  public stop(): void {
    if (this._subscriptionToken) {
      PubSub.unsubscribe(this._subscriptionToken);
      this._subscriptionToken = null;
    }
  }

  private async handleMessage(topic: string, messageWrapper: MessageWrapper): Promise<void> {
    const { message, channel, channelMessage } = messageWrapper;

    await this.onMessage(message as T);

    if (channel && channelMessage) {
      try {
        channel.ack(channelMessage);
      } catch (err) {
        console.error('can not ack', message);
      }
    }
  }
}
