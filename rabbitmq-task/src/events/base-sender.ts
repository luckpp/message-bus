import { ConfirmChannel } from 'amqplib';

export class BaseSender {
  private channel: ConfirmChannel;
  private queueName: string;

  constructor(channel: ConfirmChannel, queueName: string) {
    this.channel = channel;
    this.queueName = queueName;
  }
  public sendAsync(message: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const result = await this.channel.sendToQueue(
        this.queueName,
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
    });
  }
}
