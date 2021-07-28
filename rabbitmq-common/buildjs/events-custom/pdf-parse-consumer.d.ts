import { BaseConsumer } from '../events/base-consumer';
import { ConnectionPool } from '../events/connection-pool';
import { MessageTypes } from '../events/message-types';
import { QueueNames } from '../events/queue-names';
import { PdfParseMessage } from './pdf-parse-message';
export declare class PdfParseConsumer extends BaseConsumer<PdfParseMessage> {
    protected _queueName: QueueNames.worker;
    protected _messageType: MessageTypes.pdfParse;
    constructor(connectionPool: ConnectionPool);
    onMessage(message: PdfParseMessage): Promise<void>;
}
