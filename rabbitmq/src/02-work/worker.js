const amqp = require('amqplib');
const uuid = require('uuid');
const { green } = require('chalk');

function consumer(msg, channel) {
  if (msg) {
    const content = msg.content.toString();
    console.log(` [x] Received ${content}`);
    const contentJson = JSON.parse(content);
    setTimeout(() => {
      console.log(green(' [x] Done'));
      channel.ack(msg);
    }, contentJson.delay * 1000);
  } else {
    console.error('null message');
  }
}

async function receiveAsync() {
  const queueName = '02-work-queue';

  try {
    const connection = await amqp.connect('amqp://localhost?heartbeat=1');
    connection.on('close', () => {
      console.log('[Worker] Connection has been closed!');
    });
    connection.on('error', (err) => {
      console.log('[Worker] Connection has been closed!');
    });
    const channel = await connection.createConfirmChannel();
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // This tells RabbitMQ not to give more than one message to a worker at a time.  Or, in other words,
    // don't dispatch a new message to a worker until it has processed and acknowledged the previous one.
    // Instead, it will dispatch it to the next worker that is not still busy.
    channel.prefetch(1);

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queueName);

    channel.consume(queueName, (msg) => consumer(msg, channel), {
      noAck: false, // manual acknowledgment mode
    });
  } catch (err) {
    console.error(err);
  }
}

receiveAsync();
