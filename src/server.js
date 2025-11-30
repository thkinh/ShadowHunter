import { WebSocketServer } from "ws";
import { createPacket, MessageType, parsePacket } from "./packet.js";
import { createPacketHandlers } from "./s_handlers.js";
import { GameState } from "./game/gameState.js"
import { ActionQueue } from "./actionQueue.js";

//Server defined properties
const PORT = 7777;
const PING_INTERVAL = 5000; // every 5 seconds
const MAX_PLAYERS = 6;
const server = new WebSocketServer({port: PORT});
const gameState = new GameState();
const actionQueue = new ActionQueue();
let   nextClientID = 2008;

console.log(`Server started on ${PORT}`);
server.on("connection", (ws) => {
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  const player = gameState.addPlayer(nextClientID++);
  ws.id = player.id;
  console.log("Hello ", player);
  ws.send(createPacket(MessageType.WELCOME, {player}));

  console.log(`A client connected, total: ${server.clients.size}`);

  ws.onclose = () => {
    console.log("Connection closed (client side)");
  }
  
  ws.on("message", (msg) => {
    const packet = parsePacket(msg);
    if(!packet){
      return;
    }
    newServerHandleArrivedPacket(packet, server, ws);
  });
})

export const s_handlers = createPacketHandlers(gameState, actionQueue);

function newServerHandleArrivedPacket(packet, server, ws) {
  const handler = s_handlers[packet.type];
  if (handler) {
    handler(packet, server, ws);
  } else {
    console.warn("Unknown message type:", packet.type);
  }
}


const interval = setInterval(() => {
  server.clients.forEach(ws => {
    // console.log(`Pinging client ${ws.id}`);
    if (!ws.isAlive){ 
      console.log("A client is dead") 
      return ws.terminate(); // remove dead client
    } 
    ws.isAlive = false;
    ws.ping(); // built-in ws ping
  });
}, PING_INTERVAL);

