import { Message } from "./events/message";
import { MessageTypes } from "./events/message-types";
import { QueueNames } from "./events/queue-names";

export interface TestMessage {
  queueName: QueueNames.worker;
  type: MessageTypes.WorkerPdfParse;
  payload: {
    date: Date;
    text: string;
    uuid: string;
    delay: number;
  };
}
