const MessageType = Object.freeze({
  //100: server-client exchange
  ERROR: 0,
  DEFAULT: 100,
  WELCOME: 101,
  HELLO: 102,
  PING: 104,
  PONG: 105,

  //200: server -> client game messages
  GAME_SERVER_START: 200,
  GAME_SERVER_OVER: 201,
  GAME_SERVER_UPDATE_GAMESTATE: 202,
  GAME_SERVER_TURN_START: 210,
  GAME_SERVER_TURN_END: 211,
  GAME_SERVER_ROLL_RESULT: 220,
  GAME_SERVER_MOVE_RESULT: 221,
  GAME_SERVER_DRAWCARD_RESULT: 222,
  GAME_SERVER_ATTACK_RESULT: 223,
  GAME_SERVER_UPDATE_HP: 224,
  GAME_SERVER_PLAYER_DEFEATED: 225,

  //300: client -> server game messages
  GAME_CLIENT_TURN_READY: 300,
  GAME_CLIENT_PROCESS_QUEUE_REQUEST: 301,
  GAME_CLIENT_USE_SKILL_REQUEST: 302,
  GAME_CLIENT_USE_ITEM_REQUEST: 303,
  GAME_CLIENT_ROLL_DICE_REQUEST: 304,
  GAME_CLIENT_MOVE_REQUEST: 305,
  GAME_CLIENT_MOVE_CONFIRM: 306,
  GAME_CLIENT_ATTACK_REQUEST: 307,
  GAME_CLIENT_RESYNC_REQUEST: 308,
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
    case MessageType.GAME_CLIENT_ROLL_DICE_REQUEST:
      if(Object.prototype.toString.call(target) !== '[object Array]')
      {
        return JSON.stringify({
          type: MessageType.ERROR
        })
      }
      return createPacket(type, {dices: target});

    case MessageType.GAME_CLIENT_ATTACK_REQUEST:
      return createPacket(type, {targetId: target, damage: explicit});

    case MessageType.GAME_CLIENT_MOVE_REQUEST:
      return createPacket(type, {});

    case MessageType.GAME_CLIENT_MOVE_CONFIRM:
      return createPacket(type, {
        currentPosition: explicit.currentPosition,
        chosePosition: explicit.chosePosition
      });

    case MessageType.GAME_CLIENT_PROCESS_QUEUE_REQUEST:
      return createPacket(type, {});

    case MessageType.GAME_CLIENT_RESYNC_REQUEST:
      return createPacket(type, {});
    default:
      console.log("What the heck is this message type?");
      return;
  }

  return JSON.stringify({
    type,
    length: JSON.stringify(payload).length,
    payload,
  });
}

export {createActionPacket, MessageType, createPacket, parsePacket};
