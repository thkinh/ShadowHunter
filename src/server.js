import { WebSocketServer } from "ws";
import { createPacket, MessageType, parsePacket } from "./packet.js";
import { handlers } from "./s_handlers.js";
import { createPlayer } from "./game/player.js";

const PORT = 7777;

const server = new WebSocketServer({port: PORT});
let nextClientID = 2008;

console.log(`Server started on ${PORT}`);
server.on("connection", (ws) => {

  const player = createPlayer(nextClientID++);
  console.log(player);
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
  const handler = handlers[packet.type];
  if (handler) {
    handler(packet, server, ws);
  } else {
    console.warn("Unknown message type:", packet.type);
  }
}

// function oldServerHandleArrivedPacked(packet, server, ws) {
//   switch(packet.type){
//     case MessageType.DEFAULT:
//       console.log(`PACKET DEFAULT: ${packet.payload}`)
//       break;
//     case MessageType.HELLO:
//       console.log(`PACKET HELLO: ${packet.payload}`)
//       break;
//     case MessageType.GAME_CLIENT_ROLLDICE:
//       const random4 = getRandomIntInclusive(1,4);
//       const random6 = getRandomIntInclusive(1,6);
//       server.clients.forEach((client) => {
//         if(client.readyState == ws.OPEN){
//           client.send(
//             createPacket(MessageType.GAME_SERVER_RESPONSE_ROLLDICE, {
//               d4: random4,
//               d6: random6,
//               rollerId: ws.id
//             })
//           );
//         }
//       })
// 
//       break;
// 
//       
//     default:
//       console.warn("Unknown message type:", packet.type);
//   }
// }



