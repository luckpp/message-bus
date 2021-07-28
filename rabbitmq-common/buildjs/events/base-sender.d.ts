import { BusWrapper } from './bus-wrapper';
import { Message } from './message';
export declare abstract class BaseSender<T extends Message> {
    protected abstract _queueName: T['queueName'];
    protected abstract _messageType: T['type'];
    private _busWrapper;
    constructor(busWrapper: BusWrapper);
    send(payload: T['payload']): Promise<void>;
}
