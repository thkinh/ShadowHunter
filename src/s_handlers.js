import { getRandomIntInclusive } from "./utils.js"
import { MessageType, createPacket } from "./packet.js"

function handleDefault(packet, server, ws) {
  console.log(`PACKET DEFAULT: ${packet.payload}`);
}

function handleHello(packet, server, ws) {
  console.log(`PACKET HELLO: ${packet.payload}`);
}

function handleRollDice(packet, server, ws) {
  console.log(`Packet type: ${packet.type}`);
  const { dice } = packet.payload; // e.g., [4, 6]
  const results = dice.map(sides => getRandomIntInclusive(1, sides));

  server.clients.forEach(client => {
    if (client.readyState === ws.OPEN) {
      client.send(
        createPacket(MessageType.GAME_SERVER_RESPONSE_ROLLDICE, {
          results,
          rollerId: ws.id,
        })
      );
    }
  });
}

// Export a map from MessageType → handler
export const s_handlers = {
  [MessageType.DEFAULT]: handleDefault,
  [MessageType.HELLO]: handleHello,
  [MessageType.GAME_CLIENT_ROLLDICE]: handleRollDice,
};

