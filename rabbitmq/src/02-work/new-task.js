const amqp = require('amqplib');
const { green } = require('chalk');
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
    const channel = await connection.createConfirmChannel();
    await channel.assertQueue(queueName, {
      durable: true, // make sure that the queue will survive a RabbitMQ node restart
    });
    // Marking messages as persistent doesn't fully guarantee that a message won't be lost.
    // Although it tells RabbitMQ to save the message to disk, there is still a short time window
    // when RabbitMQ has accepted a message and hasn't saved it yet.
    // If you need a stronger guarantee then you can use publisher confirms.
    const result = await channel.sendToQueue(queueName, Buffer.from(message), { persistent: true }, (err, ok) => {
      console.log(err);
      console.log(ok);

      if (connection) {
        connection.close();
      }
      process.exit(0);

    });
    console.log(green(`Message [${message}] sent! -> result [${result}]`));
  } catch (err) {
    console.error(err);
  } finally {
    // if (connection) {
    //   connection.close();
    // }
    // process.exit(0);

    setTimeout(function () {
      if (connection) {
        connection.close();
      }
      process.exit(0);
    }, 15000);
  }
}

sendAsync('Message 1');
// sendAsync('Message 2');
// sendAsync('Message 3');
// sendAsync('Message 4');
// sendAsync('Message 5');
