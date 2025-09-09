import { WebSocketServer } from "ws";
import { createPacket, MessageType, parsePacket } from "./packet.js";
import { s_handlers } from "./s_handlers.js";
import { createPlayer } from "./game/player.js";
import { GameState } from "./game/gameState.js"

const PORT = 7777;
const PING_INTERVAL = 5000; // every 5 seconds
const MAX_PLAYERS = 6;

const server = new WebSocketServer({port: PORT});
let nextClientID = 2008;
const gameState = new GameState();

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

