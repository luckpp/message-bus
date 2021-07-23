import { Message } from './events/message';
import { MessageTypes } from './events/message-types';
import { QueueNames } from './events/queue-names';

export interface PdfParseMessage {
  queueName: QueueNames.worker;
  type: MessageTypes.pdfParse;
  payload: {
    pdfPath: string;
  };
}
