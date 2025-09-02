const MessageType = Object.freeze({
  //100 is server client exhange messages
  //200 is server side game message
  //300 is client side game message
  ERROR: 0,
  DEFAULT: 100,
  WELCOME: 101,
  HELLO: 102,
  PING: 104,
  PONG: 105,
  GAME_SERVER_UPDATE_GAMESTATE: 200,
  GAME_SERVER_RESPONSE_ROLLDICE: 201,
  GAME_CLIENT_ROLLDICE: 301,
  GAME_CLIENT_ATTACKS: 302,
  GAME_CLIENT_USEITEM: 303,
});

function createPacket(type, payload) {
  return JSON.stringify({
    type, // integer 
    length: JSON.stringify(payload).length,
    payload
  });
}

function parsePacket(message) {
  try {
    const packet = JSON.parse(message);
    return packet; // { type: int, length: num, payload: any }
  } catch (err) {
    console.error("Failed to parse packet:", err);
    return null;
  }
}

function createActionPacket(type, target, explicit) {
  switch(type) {
    case MessageType.GAME_CLIENT_ROLLDICE:
      if(Object.prototype.toString.call(target) !== '[object Array]')
      {
        return JSON.stringify({
          type: MessageType.ERROR
        })
      }
      return createPacket(type, {dice: target});
      break;
    case MessageType.GAME_CLIENT_ATTACKS:
      return createPacket(type, {targetId: target, damage: explicit});
      break;
      
  }

  return JSON.stringify({
    type,
    length: JSON.stringify(payload).length,
    payload,
  })
}

export {createActionPacket, MessageType, createPacket, parsePacket};
