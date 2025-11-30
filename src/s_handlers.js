import { getRandomIntInclusive } from "./utils.js"
import { MessageType, createPacket } from "./packet.js"

function handleError(packet, server, ws){
  console.log(`PACKET ERROR FROM CLIENT: ${ws.id}`)
  ws.send(createPacket(MessageType.ERROR, {source: packet.type}))
}

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
        createPacket(MessageType.GAME_SERVER_ROLL_RESULT, {
          results,
          rollerId: ws.id,
        })
      );
    }
  });
}

function handleAttacksPlayer(packet, server, ws) {
  // Push the action to action queue
  console.log(`Packet type: ${packet.type}`);
  console.log(`Player ${packet.payload.targetId} is attacked by ${ws.id}`)
  console.log(`Player ${packet.payload.targetId}'s HP is now -${packet.payload.damage}`)
  
}

// Export a map from MessageType → handler
//export const s_handlers = {
//  [MessageType.DEFAULT]: handleDefault,
//  [MessageType.ERROR]: handleError,
//  [MessageType.HELLO]: handleHello,
//  [MessageType.GAME_CLIENT_ROLL_DICE_REQUEST]: (packet, server, ws, actionQueue handleRollDice,
//  [MessageType.GAME_CLIENT_ATTACK_REQUEST]: handleAttacksPlayer,
//};

//Use Factory instead of return a static object s_handler
export function createPacketHandlers(gameState, actionQueue){
  return {
    [MessageType.DEFAULT]: handleDefault,
    [MessageType.ERROR]: handleError,
    [MessageType.HELLO]: handleHello,

    //TODO: refractor the handleRollDice so that it add an action, not handling it directly
    [MessageType.GAME_CLIENT_ROLL_DICE_REQUEST]: (packet, server, ws) => handleRollDice(packet, server, ws, gameState, actionQueue),
    //TODO: refractor the handleAttacksPlayer so that it add an action, not handling it directly
    [MessageType.GAME_CLIENT_ATTACK_REQUEST]: (packet, server, ws) => handleAttacksPlayer(gameState, actionQueue),
  }
}

