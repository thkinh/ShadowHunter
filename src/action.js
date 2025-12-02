import { getRandomIntInclusive } from "./utils.js"
import { MessageType, createPacket } from "./packet.js"

//class Action {
//  constructor() {
//    throw new Error("This is an interface, no real constructor");
//  }
//
//  execute() {
//    throw new Error("This is an interface, no execute() given");
//  }
//}

export class GameAction {
  constructor() {
    if (new.target === GameAction) {
      throw new Error("GameAction is abstract!");
    }
  }

  execute(_) {
    throw new Error("execute() must be implemented by subclass");
  }
}


export class NetworkingAction{
  constructor() {
    if (new.target === NetworkingAction) {
      throw new Error("NetworkingAction is abstract!");
    }
  }

  execute(_) {
    throw new Error("execute() must be implemented by subclass");
  }
}

export class MovePlayerRequest extends GameAction {
}

export class MovePlayer extends GameAction {
  constructor(playerID, currentPosition, chosePosition) {
    super();
    this.playerID = playerID;
    this.currentPosition = currentPosition,
    this.chosePosition = chosePosition
  }

  execute(context) {
    //Just move to the chose position
  }
}

//Because both move and attack requires roll dices, therefore we should split it into another class
export class RollDice extends GameAction {
  constructor(dices){
    super();
    this.dices = dices;
  }
  execute(context) {
    const result = this.dices.map(sides => {
      return getRandomIntInclusive(1, sides);
    });
    context.gameState.update({dices: result });
  }
}

export class ResponseMovePlayer extends GameAction {
  constructor(playerID, confirmedPosition) {
    this.playerID = playerID,
    this.confirmedPosition = confirmedPosition
  }

  execute(context) {
    context.server.clients.forEach(client => {
      if (client.readyState === context.ws.OPEN) {
        client.send(
          createPacket(MessageType.GAME_SERVER_MOVE_RESULT, {
            playerID: this.playerID,
            confirmedPosition: this.confirmedPosition
          })
        );
      }
    });
  }
}

export class ResponseRollDices extends NetworkingAction {
  constructor(playerID) {
    super();
    this.playerID = playerID;
  }

  execute(context) {
    this.result = context.gameState.dices;
    context.server.clients.forEach(client => {
      if (client.readyState === context.ws.OPEN) {
        client.send(
          createPacket(MessageType.GAME_SERVER_ROLL_RESULT, {
            results: this.result,
            rollerId: this.playerID,
          })
        );
      }
    });
  }
}
