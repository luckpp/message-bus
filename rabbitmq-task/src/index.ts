import { Dummy, Util, BusWrapper, ConnectionPool, PdfParseMessage, PdfParseSender, PdfParseConsumer } from 'rabbitmq-common';

async function sendAsync() {
  const busWrapper = new BusWrapper('localhost', 5672);
  const sender = new PdfParseSender(busWrapper);

  for (var i = 0; i < 100; i++) {
    const payload: PdfParseMessage['payload'] = {
      pdfPath: `/tmp/file_${i}.pdf`,
    };
    try {
      console.log(`sending: `, payload);
      await sender.send(payload);
      await Util.Delay(10 * 1000);
    } catch (err) {
      console.log(`sending failed: `, payload);
      await Util.Delay(10 * 1000);
    }
  }

  console.log(`Message sent!`);
  console.log('Press CTRL+C to exit!');
}

async function consumeAsync() {
  try {
    const busWrapper = new BusWrapper('localhost', 5672);
    const connectionPool = new ConnectionPool(busWrapper);
    const consumer = new PdfParseConsumer(connectionPool);
    await consumer.startConsume();
  } catch (err) {
    console.log('ERR: ', err);
  }
}

sendAsync();
consumeAsync();
