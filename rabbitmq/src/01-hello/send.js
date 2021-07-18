const amqp = require('amqplib');
const uuid = require('uuid');
const { green } = require('chalk');

async function sendAsync() {
  const queueName = 'hello';
  const message = `[${new Date().toISOString()}] from async channel: ${uuid.v4()}`;
  let connection = null;

  try {
    connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {
      durable: false,
    });
    channel.sendToQueue(queueName, Buffer.from(message));
  } catch (err) {
    console.error(err);
  } finally {
    setTimeout(function () {
      if (connection) {
        connection.close();
      }
      process.exit(0);
    }, 500);
  }
}

sendAsync();
