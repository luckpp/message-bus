import { v4 } from "uuid";
import { BusWrapper } from "./events/bus-wrapper";
import { MessageTypes } from "./events/message-types";
import { TestSender } from "./test-sender";
import { Util } from "./util/util";

async function sendAsync() {
  const busWrapper = new BusWrapper();
  const sender = new TestSender(busWrapper);

  for (var i = 0; i < 3; i++) {
    const payload = {
      date: new Date(),
      text: `${i}`,
      uuid: v4(),
      delay: 4,
    };
    await sender.send(MessageTypes.WorkerPdfParse, payload);
    await Util.Delay(30 * 1000);
  }

  console.log(`Message sent!`);
  console.log("Press CTRL+C to exit!");
}

sendAsync();
