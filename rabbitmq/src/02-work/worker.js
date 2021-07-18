const amqp = require('amqplib');
const uuid = require('uuid');
const { green } = require('chalk');

function consumer(msg, channel) {
  const content = msg.content.toString();
  console.log(` [x] Received ${content}`);
  const contentJson = JSON.parse(content);
  setTimeout(() => {
    console.log(green(' [x] Done'));
    channel.ack(msg);
  }, contentJson.delay * 1000);
}

async function receiveAsync() {
  const queueName = '02-work-queue';

  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // This tells RabbitMQ not to give more than one message to a worker at a time.  Or, in other words,
    // don't dispatch a new message to a worker until it has processed and acknowledged the previous one.
    // Instead, it will dispatch it to the next worker that is not still busy.
    channel.prefetch(1);

    console.log(
      ' [*] Waiting for messages in %s. To exit press CTRL+C',
      queueName
    );

    channel.consume(queueName, (msg) => consumer(msg, channel), {
      noAck: false, // manual acknowledgment mode
    });
  } catch (err) {
    console.error(err);
  }
}

receiveAsync();
