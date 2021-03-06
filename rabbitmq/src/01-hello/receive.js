const amqp = require('amqplib');
const uuid = require('uuid');
const { green } = require('chalk');

function consumer(msg) {
  const content = msg.content.toString();
  console.log(` [x] Received ${content}`);
}

async function receiveAsync() {
  const queueName = '01-hello-queue';

  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {
      durable: false,
    });
    channel.consume(queueName, consumer, {
      noAck: true, // automatic acknowledgment mode
    });
  } catch (err) {
    console.error(err);
  }
}

receiveAsync();
