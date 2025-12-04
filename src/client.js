import { WebSocket } from "ws";
import { createActionPacket, createPacket, parsePacket, MessageType } from "./packet.js"
import { sleep } from "./utils.js" 
import { c_handlers } from "./c_handlers.js"
import { GameState } from "./game/gameState.js"
import { createPlayer } from "./game/player.js";

//const IP = `192.168.1.4`;
const IP = `localhost`;
const PORT = 7777;
const client = new WebSocket(`ws://${IP}:${PORT}`);

client.gameState = new GameState();
client.player = createPlayer();

client.onerror = (err) => {
  console.error(`❌CLIENT ERROR: ${err}`);
}

client.onclose = () => {
  console.log("🔌Connection closed (maybe server is down)");
};

client.onopen = () => {
  console.log("Server found!");
  
  const packet = createPacket(MessageType.HELLO, "Hello server");
  client.send(packet);
  
  async function test(c) {
    await sleep(2*1000);
    console.log("Request the game state");
    const packet = createActionPacket(MessageType.GAME_CLIENT_RESYNC_REQUEST, {});
    c.send(packet);

    await sleep(2 * 1000);
    console.log("Roll the dices");
    const packet2 = createActionPacket(MessageType.GAME_CLIENT_ROLL_DICE_REQUEST, [4,6]);
    c.send(packet2);
    const processRequestPacket = createActionPacket(MessageType.GAME_CLIENT_PROCESS_QUEUE_REQUEST);
    c.send(processRequestPacket);


    //To move the character
    await sleep(2*1000);
    const moveConfirmPacket = createActionPacket(MessageType.GAME_CLIENT_MOVE_CONFIRM, {}, {
      currentPosition: client.player.position,
      chosePosition: 8 //Example game area
    });
    const processRequestPacket2 = createActionPacket(MessageType.GAME_CLIENT_PROCESS_QUEUE_REQUEST);
    c.send(moveConfirmPacket);
    c.send(processRequestPacket);

    await sleep(2*1000);
    const attackPacket = createActionPacket(MessageType.GAME_CLIENT_ATTACK_REQUEST, 2008, 4);
    const processRequestPacket3 = createActionPacket(MessageType.GAME_CLIENT_PROCESS_QUEUE_REQUEST);
    c.send(attackPacket);
    c.send(processRequestPacket3);
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


