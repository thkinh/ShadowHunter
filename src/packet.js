const MessageType = Object.freeze({
  DEFAULT: 100,
  WELCOME: 101,
  HELLO: 102,
  PING: 104,
  PONG: 105,
  GAME_CLIENT_ROLLDICE: 501,
  GAME_CLIENT_ROLLDICE4: 504,
  GAME_CLIENT_ROLLDICE6: 506,
  GAME_SERVER_RESPONSE_ROLLDICE: 201,
  GAME_SERVER_RESPONSE_ROLLDICE4: 204,
  GAME_SERVER_RESPONSE_ROLLDICE6: 206,
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

export {MessageType, createPacket, parsePacket};
