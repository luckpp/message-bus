import { BaseSender } from './events/base-sender';
import { BusWrapper } from './events/bus-wrapper';
import { MessageTypes } from './events/message-types';
import { QueueNames } from './events/queue-names';
import { TestMessage } from './test-message';

export class TestSender extends BaseSender<TestMessage> {
  protected _queueName: QueueNames.worker = QueueNames.worker;
  protected _messageType: MessageTypes.WorkerPdfParse =
    MessageTypes.WorkerPdfParse;

  constructor(busWrapper: BusWrapper) {
    super(busWrapper);
  }
}
