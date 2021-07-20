import { BaseSender } from "./events/base-sender";
import { ChannelWrapper } from "./events/channel-wrapper";
import { QueueNames } from "./events/queue-names";
import { TestMessage } from "./test-message";

export class TestSender extends BaseSender<TestMessage> {
  protected _queueName: QueueNames = QueueNames.worker;

  constructor(channelWrapper: ChannelWrapper) {
    super(channelWrapper);
  }
}
