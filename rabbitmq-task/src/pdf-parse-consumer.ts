import { BaseConsumer } from './events/base-consumer';
import { BusWrapper } from './events/bus-wrapper';
import { ConnectionPool } from './events/connection-pool';
import { MessageTypes } from './events/message-types';
import { QueueNames } from './events/queue-names';
import { PdfParseMessage } from './pdf-parse-message';

export class PdfParseConsumer extends BaseConsumer<PdfParseMessage> {
  protected _queueName: QueueNames.worker = QueueNames.worker;
  protected _messageType: MessageTypes.pdfParse = MessageTypes.pdfParse;

  constructor(connectionPool: ConnectionPool) {
    super(connectionPool);
  }
}
