import { BusWrapper } from './bus-wrapper';
import { QueueNames } from './queue-names';
export declare class ConnectionPool {
    private _busWrapper;
    private _consumeQueues;
    constructor(busWrapper: BusWrapper);
    private checkHealth;
    startConsume(queueName: QueueNames): Promise<void>;
    private startConsumeInternal;
    private messageHandler;
    private executeWithRetry;
}
