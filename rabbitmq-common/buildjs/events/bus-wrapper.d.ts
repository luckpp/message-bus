import { ConfirmChannel } from 'amqplib';
import { QueueNames } from './queue-names';
export declare class BusWrapper {
    private readonly _host;
    private readonly _port;
    private _connection;
    private _channel;
    private _lock;
    constructor(host: string, port: number);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getSendChannel(queueName: QueueNames): Promise<ConfirmChannel | null>;
    getConsumeChannel(queueName: QueueNames): Promise<ConfirmChannel | null>;
    private assertQueue;
    private execute;
}
