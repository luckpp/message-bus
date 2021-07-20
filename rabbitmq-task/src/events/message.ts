import { MessageTypes } from "./message-types";
import { QueueNames } from "./queue-names";

export interface Message {
  queueName: QueueNames;
  type: MessageTypes;
  payload: any;
}
