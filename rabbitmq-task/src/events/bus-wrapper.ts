import amqp, { Connection, ConfirmChannel } from 'amqplib';
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

  public async getChannel(queueName: QueueNames): Promise<ConfirmChannel> {
    await this.connect();
    this._channel!.assertQueue(queueName, {
      durable: true, // make sure that the queue will survive a RabbitMQ node restart
    });
    return this._channel!;
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
