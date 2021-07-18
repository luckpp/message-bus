const amqp = require('amqplib');
const uuid = require('uuid');
const { green } = require('chalk');

function consumer(msg) {
  const content = msg.content.toString();
  console.log(` [x] Received ${content}`);
  const contentJson = JSON.parse(content);
  setTimeout(() => {
    console.log(green(' [x] Done'));
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
    channel.consume(queueName, consumer, {
      noAck: true, // automatic acknowledgment mode
    });
  } catch (err) {
    console.error(err);
  }
}

receiveAsync();
