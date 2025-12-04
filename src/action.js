import { getRandomIntInclusive } from "./utils.js"
import { MessageType, createPacket } from "./packet.js"
import { GameArea } from "./game/board.js"

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

export class ResponseResyncAction extends NetworkingAction {
  constructor() {
    super();
  }

  execute(context) {
    const currentGameState = context.gameState;
    console.log(currentGameState.decks);
    console.log(currentGameState.players);
    context.server.clients.forEach(client => {
      if (client.readyState === context.ws.OPEN) {
        client.send(
          createPacket(MessageType.GAME_SERVER_UPDATE_GAMESTATE, {
            decks:    Array.from(currentGameState.decks.entries()),
            players: Array.from(currentGameState.players.entries()),
            totalPlayerJoined: currentGameState.totalPlayers,
            turn: currentGameState.turn,
            round: currentGameState.round,
            dices: currentGameState.dices,
          })
        );
      }
    });
    return true;
  }
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
    const totalRolledNumber = context.gameState.dices.reduce((a,b) => {return a+b});
    const player = context.gameState.getPlayer(this.playerID);
    if(totalRolledNumber != 7 && this.chosePosition != totalRolledNumber) {
      console.log("Invalid move!");
      return false;
    }
    player.position = this.chosePosition;
    console.log(player);
    return true;
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
    return true;
  }
}

export class ResponseMovePlayer extends NetworkingAction{
  constructor(playerID) {
    super();
    this.playerID = playerID;
  }

  execute(context) {
    const player = context.gameState.getPlayer(this.playerID);
    context.server.clients.forEach(client => {
      if (client.readyState === context.ws.OPEN) {
        client.send(
          createPacket(MessageType.GAME_SERVER_MOVE_RESULT, {
            playerID: this.playerID,
            confirmedPosition: player.position
          })
        );
      }
    });
    return true;
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
    return true;
  }
}

export class AttackAction extends GameAction {
  constructor(playerId, targetID, damage) {
    super();
    this.playerId = playerId;
    this.targetId = targetID;
    this.damage = damage;
  }

  execute(context) {
    const dices = context.gameState.dices;
    //const player = context.gameState.getPlayer(this.playerId);
    const targetPlayer = context.gameState.getPlayer(this.targetId);
    //Check if any specical skill prevent this event
    const realDamage = dices.reduce((a, b) => {return Math.abs(a-b)});
    targetPlayer.hp -= realDamage;
  }
}

export class ResponseAttackAction extends NetworkingAction {
  constructor(playerId, targetId) {
    super();
    this.playerId = playerId;
    this.targetId = targetId;
  }

  execute(context) {
    const targetHealth = context.gameState.getPlayer(this.targetId).hp;
    const attackerHealth = context.gameState.getPlayer(this.playerId).hp;
    context.server.clients.forEach(client => {
      if (client.readyState === context.ws.OPEN) {
        client.send(
          createPacket(MessageType.GAME_SERVER_ATTACK_RESULT, {
            targetId: this.targetId,
            attackerId: this.playerId,
            targetHealth,
            attackerHealth
          })
        );
      }
    });
  }
}
