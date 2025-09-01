import { MessageType } from "./packet.js"

function c_handleRollDice(packet, client){
  const dices = packet.payload; 
  console.log(dices);
}

function c_handleWelcome(packet, client){
  console.log(`Received packet ${packet.type},`)
  client.player = packet.payload.player;
  console.log("Player created: ", client.player);
}



// Export a map from MessageType → handler
export const c_handlers = {
  [MessageType.WELCOME]: c_handleWelcome,
  [MessageType.GAME_SERVER_RESPONSE_ROLLDICE]: c_handleRollDice,
};

