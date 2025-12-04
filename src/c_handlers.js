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
  console.log(newState);
  client.gameState.decks = newState.decks;
  client.gameState.totalPlayers = newState.totalPlayerJoined;
  client.gameState.players = newState.players;
  client.gameState.turn = newState.turn;
  client.gameState.round= newState.round;
  client.gameState.dices= newState.dices;
  console.log(client.gameState);
}

function c_handlePlayerMove(packet, client){
  const movedPlayer = packet.payload.playerID;
  const newPosition = packet.payload.confirmedPosition;
  console.log(`--> Player ${movedPlayer} moved to ${newPosition}`);
  if(client.player.position == newPosition || newPosition == 0) {
    console.log(`Invalid movement: player ${movedPlayer}`);
  }
  if(client.playerID == movedPlayer) {
    client.player.position = newPosition;
  }
}

function c_handleAttackResult(packet, client) {
  const targetId = packet.payload.targetId;
  const targetHealth = packet.payload.targetHealth;
  const attackerId = packet.payload.attackerId;
  const attackerHealth = packet.payload.attackerHealth;
  console.log(`Player ${attackerId} just attacked player ${targetId}`);
  console.log(client.gameState);
  const attacker = client.gameState.getPlayer(attackerId);
  const target = client.gameState.getPlayer(targetId);
  attacker.hp = attackerHealth;
  target.hp = targetHealth;
  console.log(`Player ${attackerId} is now ${attackerHealth}`);
  console.log(`Player ${targetId} is now ${targetHealth}`);
}

// Export a map from MessageType → handler
export const c_handlers = {
  [MessageType.WELCOME]: c_handleWelcome,
  [MessageType.PING]: c_handlePing,
  [MessageType.PONG]: c_handlePong,
  [MessageType.ERROR]: c_handleErrorPacket,
  [MessageType.GAME_SERVER_UPDATE_GAMESTATE]: c_handleUpdateState,
  [MessageType.GAME_SERVER_ROLL_RESULT]: c_handleRollDice,
  [MessageType.GAME_SERVER_MOVE_RESULT]: c_handlePlayerMove,
  [MessageType.GAME_SERVER_ATTACK_RESULT]: c_handleAttackResult,
};

