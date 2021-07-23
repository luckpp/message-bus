import amqp, { Connection, ConfirmChannel } from 'amqplib';
import PubSub from 'pubsub-js';
import { Util } from '../util/util';
import { QueueNames } from './queue-names';

export class BusWrapper {
  private readonly _host: string;
  private readonly _port: number;

  private _connection: Connection | null;
  private _channel: ConfirmChannel | null;
  private _lock: boolean;

  constructor(host: string, port: number) {
    this._host = host;
    this._port = port;

    this._connection = null;
    this._channel = null;
    this._lock = false;
  }

  public async connect(): Promise<void> {
    await this.execute(async () => {
      if (this._connection && this._channel) {
        return;
      }
      this._connection = await amqp.connect(
        `amqp://${this._host}:${this._port}?heartbeat=1`
      );
      this._channel = await this._connection.createConfirmChannel();

      this._connection.on('close', async () => {
        this._connection = null;
        this._channel = null;
      });
      this._channel.on('close', () => {
        this._connection = null;
        this._channel = null;
      });
    });
  }

  public async disconnect(): Promise<void> {
    await this.execute(async () => {
      if (this._connection) {
        await this._connection.close();
      }
    });
  }

  public async getSendChannel(
    queueName: QueueNames
  ): Promise<ConfirmChannel | null> {
    await this.connect();
    await this.assertQueue(queueName);
    return this._channel;
  }

  public async getConsumeChannel(
    queueName: QueueNames
  ): Promise<ConfirmChannel | null> {
    await this.connect();
    await this.assertQueue(queueName);
    // This tells RabbitMQ not to give more than one message to a worker at a time.  Or, in other words,
    // don't dispatch a new message to a worker until it has processed and acknowledged the previous one.
    // Instead, it will dispatch it to the next worker that is not still busy.
    if (this._channel) {
      this._channel.prefetch(1);
    }
    return this._channel;
  }

  private async assertQueue(queueName: QueueNames) {
    await this.execute(async () => {
      if (this._channel) {
        this._channel.assertQueue(queueName, {
          durable: true, // make sure that the queue will survive a RabbitMQ node restart
        });
      }
    });
  }

  private async execute(operation: () => Promise<void>): Promise<void> {
    while (this._lock) {
      await Util.Delay(500);
    }
    try {
      this._lock = true;
      await operation();
    } finally {
      this._lock = false;
    }
  }
}
