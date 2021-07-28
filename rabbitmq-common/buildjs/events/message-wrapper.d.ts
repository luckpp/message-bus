import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { Message } from './message';
export interface MessageWrapper {
    message: Message;
    channel: ConfirmChannel;
    channelMessage: ConsumeMessage | null;
}
