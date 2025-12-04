import { MessageType, createPacket } from "./packet.js"
import { ResponseRollDices, RollDice, MovePlayer, ResponseMovePlayer, AttackAction, ResponseAttackAction, NetworkingAction, ResponseResyncAction } from "./action.js"

function handleError(packet){
  console.log(`PACKET ERROR FROM CLIENT: ${ws.id}`)
  ws.send(createPacket(MessageType.ERROR, {source: packet.type}))
}

function handleDefault(packet) {
  console.log(`PACKET DEFAULT: ${packet.payload}`);
}

function handleHello(packet) {
  console.log(`PACKET HELLO: ${packet.payload}`);
}

function handleResyncRequest(packet, server, ws) {
  console.log(`PACKET SYNC: ${packet.type}`)
  const responseResyncAction = new ResponseResyncAction();
  server.actionQueue.enqueue(responseResyncAction);
  const context =  {
    gameState: server.gameState,
    actionQueue: server.actionQueue,
    server,
    ws,
  }
  server.actionQueue.processAll(context);
}

function handleProcessQueueRequest(packet, server, ws) {
  console.log(`Packet type: ${packet.type}`);
  const context =  {
    gameState: server.gameState,
    actionQueue: server.actionQueue,
    server,
    ws
  }
  server.actionQueue.processAll(context);
}

function handleRollDiceRequest(packet, server, ws) {
  console.log(`Packet type: ${packet.type}`);
  const { dices } = packet.payload;
  if (!Array.isArray(dices)) {
    throw new Error("Invalid payload: dice must be an array.")
  };
  //console.log("Dices recived from packet: ", dices);
  const rollDiceAction = new RollDice(dices);
  const responseAction = new ResponseRollDices(ws.id);
  server.actionQueue.enqueue(rollDiceAction);
  server.actionQueue.enqueue(responseAction);
}

function handleMoveConfirm(packet, server, ws) {
  console.log(`Packet type: ${packet.type}`);
  const currentPosition = packet.payload.currentPosition;
  const chosePosition = packet.payload.chosePosition;
  const moveAction = new MovePlayer(ws.id, currentPosition, chosePosition);
  const moveResponseAction = new ResponseMovePlayer (ws.id);
  server.actionQueue.enqueue(moveAction);
  server.actionQueue.enqueue(moveResponseAction);
}

function handleAttacksPlayer(packet, server, ws) {
  console.log(`Packet type: ${packet.type}`);
  const target = packet.payload.targetId;
  const damage = packet.payload.damage;
  const attackAction = new AttackAction(ws.id, target, damage);
  const attackRespondAction = new ResponseAttackAction(ws.id, target);
  server.actionQueue.enqueue(attackAction);
  server.actionQueue.enqueue(attackRespondAction);
}
  
//Use Factory instead of return a static object s_handler
export function createPacketHandlers(){
  return {
    [MessageType.DEFAULT]:(packet)  => handleDefault(packet),
    [MessageType.ERROR]:  (packet)  => handleHello(packet),
    [MessageType.HELLO]:  (packet)  => handleHello(packet),
    [MessageType.GAME_CLIENT_RESYNC_REQUEST]: (packet, server, ws) => handleResyncRequest(packet, server, ws),
    [MessageType.GAME_CLIENT_PROCESS_QUEUE_REQUEST]: handleProcessQueueRequest,
    [MessageType.GAME_CLIENT_ROLL_DICE_REQUEST]: handleRollDiceRequest,
    //TODO: refractor the handleAttacksPlayer so that it add an action to server.actionQueue, not handling it directly
    [MessageType.GAME_CLIENT_MOVE_CONFIRM]: handleMoveConfirm,
    [MessageType.GAME_CLIENT_ATTACK_REQUEST]: handleAttacksPlayer,
  }
}

