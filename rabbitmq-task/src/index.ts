import amqp, { Connection } from "amqplib";
import { v4 } from "uuid";
import { BaseSender } from "./events/base-sender";
import { ChannelWrapper } from "./events/channel-wrapper";
import { MessageTypes } from "./events/message-types";
import { QueueNames } from "./events/queue-names";
import { TestSender } from "./test-sender";

async function sendAsync(text: string) {
  const payload = {
    date: new Date(),
    text,
    uuid: v4(),
    delay: 4,
  };
  let connection: Connection;

  try {
    connection = await amqp.connect("amqp://localhost");
    const queueName = QueueNames.worker;
    const channel = await connection.createConfirmChannel();
    await channel.assertQueue(queueName, {
      durable: true, // make sure that the queue will survive a RabbitMQ node restart
    });

    const channelWrapper = new ChannelWrapper(channel);
    const sender = new TestSender(channelWrapper);
    await sender.sendAsync(MessageTypes.WorkerPdfParse, payload);

    console.log(`Message sent!`);
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Press CTRL+C to exit!");
  }
}

sendAsync("Message 1");

setTimeout(() => {
  console.log("Done!");
}, 60 * 60 * 1000);
