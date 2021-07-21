import { BaseSender } from "./events/base-sender";
import { BusWrapper } from "./events/bus-wrapper";
import { QueueNames } from "./events/queue-names";
import { TestMessage } from "./test-message";

export class TestSender extends BaseSender<TestMessage> {
  protected _queueName: QueueNames = QueueNames.worker;

  constructor(busWrapper: BusWrapper) {
    super(busWrapper);
  }
}
