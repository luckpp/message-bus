import amqp, { Connection } from 'amqplib';
import { v4 } from 'uuid';
import { BaseSender } from './events/base-sender';

async function sendAsync(text: string) {
  const message = JSON.stringify({
    date: new Date().toISOString(),
    text,
    uuid: v4(),
    delay: 4,
  });
  let connection: Connection;

  try {
    connection = await amqp.connect('amqp://localhost');
    const queueName = '02-work-queue';
    const channel = await connection.createConfirmChannel();
    await channel.assertQueue(queueName, {
      durable: true, // make sure that the queue will survive a RabbitMQ node restart
    });

    const sender = new BaseSender(channel, queueName);
    await sender.sendAsync(message);

    console.log(`Message [${message}] sent!`);
  } catch (err) {
    console.error(err);
  } finally {
    console.log('Press CTRL+C to exit!');
  }
}

sendAsync('Message 1');

setTimeout(() => {
  console.log('Done!');
}, 60 * 60 * 1000);
