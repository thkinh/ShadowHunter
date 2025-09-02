import { WebSocket } from "ws";
import { createActionPacket, createPacket, parsePacket, MessageType } from "./packet.js"
import { sleep } from "./utils.js" 
import { c_handlers } from "./c_handlers.js"

//const IP = `192.168.1.4`;
const IP = `localhost`;
const PORT = 7777;
const client = new WebSocket(`ws://${IP}:${PORT}`);

client.onerror = (err) => {
  console.error(`❌ERROR: ${err}`);
}

client.onclose = () => {
  console.log("🔌Connection closed (maybe server is down)");
};

client.onopen = () => {
  console.log("Server found!");
  
  const packet = createPacket(MessageType.HELLO, "Hello server");
  client.send(packet);
  
  async function test(c) {
    await sleep(2 * 1000);
    console.log("Roll the dices");
    const packet2 = createActionPacket(MessageType.GAME_CLIENT_ROLLDICE, [4,6]);
    c.send(packet2);
    await sleep(2 * 1000);
    const packet3 = createActionPacket(MessageType.GAME_CLIENT_ATTACKS, 2009, 4);
    c.send(packet3);
  }
  test(client);



}

client.onmessage = (event) => {
  const packet = parsePacket(event.data);
  if(!packet){
    return;
  }
  clientHandleArrivedPacket(packet, client);
}

function clientHandleArrivedPacket(packet, server, ws) {
  const handler = c_handlers[packet.type];
  if (handler) {
    handler(packet, server, ws);
  } else {
    console.warn("Unknown message type:", packet.type);
  }
}


