import { BaseSender } from '../events/base-sender';
import { BusWrapper } from '../events/bus-wrapper';
import { MessageTypes } from '../events/message-types';
import { QueueNames } from '../events/queue-names';
import { PdfParseMessage } from './pdf-parse-message';

export class PdfParseSender extends BaseSender<PdfParseMessage> {
  protected _queueName: QueueNames.worker = QueueNames.worker;
  protected _messageType: MessageTypes.pdfParse = MessageTypes.pdfParse;

  constructor(busWrapper: BusWrapper) {
    super(busWrapper);
  }
}