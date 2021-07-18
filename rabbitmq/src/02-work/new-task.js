const amqp = require('amqplib');
const uuid = require('uuid');

async function sendAsync(text) {
  const queueName = '02-work-queue';
  const message = JSON.stringify({
    date: new Date().toISOString(),
    text,
    uuid: uuid.v4(),
    delay: 4,
  });
  let connection = null;

  try {
    connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, {
      durable: true,
    });
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
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

sendAsync('Message 1');
sendAsync('Message 2');
sendAsync('Message 3');
sendAsync('Message 4');
sendAsync('Message 5');
