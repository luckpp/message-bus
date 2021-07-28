import { BaseSender } from '../events/base-sender';
import { BusWrapper } from '../events/bus-wrapper';
import { MessageTypes } from '../events/message-types';
import { QueueNames } from '../events/queue-names';
import { PdfParseMessage } from './pdf-parse-message';
export declare class PdfParseSender extends BaseSender<PdfParseMessage> {
    protected _queueName: QueueNames.worker;
    protected _messageType: MessageTypes.pdfParse;
    constructor(busWrapper: BusWrapper);
}
