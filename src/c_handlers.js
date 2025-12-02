import { GameState } from "./game/gameState.js";
import { createPacket, MessageType } from "./packet.js"

function c_handleRollDice(packet){
  const dices = packet.payload; 
  console.log(dices);
}

function c_handleErrorPacket(packet){
  console.log(`Received ERROR packet},`);
  const source = packet.payload.source;
  console.log("Source: " , source);
}

function c_handleWelcome(packet, client){
  console.log(`Received packet ${packet.type},`);
  client.player = packet.payload.player;
  console.log("Player created: ", client.player);
}

function c_handlePing(packet, client){
  console.log(`Received packet ${packet.type},`);
  client.send(createPacket(MessageType.PONG, {time: packet.payload.time}));
}

function c_handlePong(packet){
  const latency = Date.now() - packet.payload.time;
  console.log(`Ping latency: ${latency} ms`);
}

function c_handleUpdateState(packet, client){
  const newState = packet.payload;
  client.gameState = newState;
  console.log(gameState.dices);
}

// Export a map from MessageType → handler
export const c_handlers = {
  [MessageType.WELCOME]: c_handleWelcome,
  [MessageType.PING]: c_handlePing,
  [MessageType.PONG]: c_handlePong,
  [MessageType.ERROR]: c_handleErrorPacket,
  [MessageType.GAME_SERVER_UPDATE_GAMESTATE]: c_handleUpdateState,
  [MessageType.GAME_SERVER_ROLL_RESULT]: c_handleRollDice,
};

