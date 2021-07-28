import { ConnectionPool } from './connection-pool';
import { Message } from './message';
export declare abstract class BaseConsumer<T extends Message> {
    protected abstract _queueName: T['queueName'];
    protected abstract _messageType: T['type'];
    private _connectionPool;
    private _subscriptionToken;
    constructor(connectionPool: ConnectionPool);
    startConsume(): Promise<void>;
    abstract onMessage(message: T): Promise<void>;
    stop(): void;
    private handleMessage;
}
