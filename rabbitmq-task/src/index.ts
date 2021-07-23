import PubSub from 'pubsub-js';
import { BusWrapper } from './events/bus-wrapper';
import { ConnectionPool } from './events/connection-pool';
import { PdfParseConsumer } from './pdf-parse-consumer';
import { PdfParseMessage } from './pdf-parse-message';
import { PdfParseSender } from './pdf-parse-sender';
import { Util } from './util/util';

async function sendAsync() {
  const busWrapper = new BusWrapper('localhost', 5672);
  const sender = new PdfParseSender(busWrapper);

  for (var i = 0; i < 100; i++) {
    const payload: PdfParseMessage['payload'] = {
      pdfPath: `/tmp/file_${i}.pdf`,
    };
    try {
      await sender.send(payload);
      await Util.Delay(10 * 1000);
      console.log(`sent: `, payload);
    } catch (err) {
      console.log(`failed: `, payload);
      await Util.Delay(20 * 1000);
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
    await consumer.consume();
  } catch (err) {
    console.log('ERR: ', err);
  }
}

// sendAsync();
consumeAsync();

// setTimeout(() => {
//   PubSub.publish(`${QueueNames.worker}.${MessageTypes.pdfParse}`, {
//     consumeMessage: 'consumeMessage',
//     channel: 'channel',
//   });
// }, 2000);

//setTimeout(() => {}, 100000);
