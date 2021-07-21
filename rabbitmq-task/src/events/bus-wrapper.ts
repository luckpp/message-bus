import amqp, { Connection, ConfirmChannel } from "amqplib";
import { Util } from "../util/util";
import { QueueNames } from "./queue-names";

export class BusWrapper {
  private _connection: Connection | null;
  private _channel: ConfirmChannel | null;
  private _connecting: boolean;

  constructor() {
    this._connection = null;
    this._channel = null;
    this._connecting = false;
  }

  public async connect(): Promise<void> {
    while (this._connecting) {
      await Util.Delay(500);
    }
    try {
      this._connecting = true;

      if (this._connection && this._channel) {
        return;
      }

      this._connection = await amqp.connect("amqp://localhost?heartbeat=1");
      this._channel = await this._connection.createConfirmChannel();

      this._connection.on("close", async () => {
        this._connection = null;
        this._channel = null;
      });
      this._channel.on("close", () => {
        this._connection = null;
        this._channel = null;
      });
    } finally {
      this._connecting = false;
    }
  }

  public async getChannel(queueName: QueueNames): Promise<ConfirmChannel> {
    await this.connect();
    this._channel!.assertQueue(queueName, {
      durable: true, // make sure that the queue will survive a RabbitMQ node restart
    });
    return this._channel!;
  }
}
