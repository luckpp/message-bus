// import { ConfirmChannel, ConsumeMessage } from 'amqplib';
// import { BusWrapper } from './bus-wrapper';
// import { Message } from './message';

// export abstract class BaseConsumer<T extends Message> {
//   protected abstract _queueName: T['queueName'];
//   protected abstract _messageType: T['type'];

//   private _busWrapper: BusWrapper;

//   constructor(busWrapper: BusWrapper) {
//     this._busWrapper = busWrapper;
//   }

//   public listen() {
//     //
//   }

//   public async consume(): Promise<void> {
//     const channel = await this._busWrapper.getConsumeChannel(this._queueName);
//     channel.consume(
//       this._queueName,
//       (consumeMessage) => this.consumeInternal(consumeMessage, channel),
//       {
//         noAck: false, // manual acknowledgment mode
//       }
//     );
//   }

//   private consumeInternal(
//     consumeMessage: ConsumeMessage | null,
//     channel: ConfirmChannel
//   ) {
//     if (consumeMessage) {
//       const content = consumeMessage.content.toString();
//       const contentJson = JSON.parse(content) as Message;
//       console.log(` [x] Received ${content}`);
//       if (contentJson.type == this._messageType) {
//         console.log(`  [x] Done ${contentJson}`);
//         channel.ack(consumeMessage);
//       } else {
//         channel.nack(consumeMessage);
//       }
//       // setTimeout(() => {
//       //   console.log(`[${this.id}][x] Done`);
//       //   // channel.ack(consumeMessage);
//       //   channel.nack(consumeMessage);
//       // }, contentJson.payload.delay * 1000);
//     } else {
//       console.error('null message');
//     }
//   }
// }
