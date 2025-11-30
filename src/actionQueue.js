import { getRandomIntInclusive } from "./utils.js"
import { GameArea } from "./game/board.js"
import { createPlayer } from "./game/player.js"

export class ActionQueue {
   constructor() {
     this.queue = [];
     this.size = 100;
     this.head = 0;
     this.tail = 0;
  }
  
  enqueue(action) {
    if(Math.abs(this.tail -  this.head) == this.size){
      //Queue is full
      return false;
    }
    this.queue[this.tail] = action;
    tail = (tail + 1) % size;
    return true;
  }

  dequeue() {
    if(this.head == this.tail){
      return false;
    }
    const action = this.queue[tail];
    return action.eval();
  }

  isEmpty() {
    return Math.abs(this.tail - this.head) == 0 ? true : false;
  }
}

export class Action {
  constructor(actionId, playerId, hasSideEffect) {
    this.actionId = actionId;
    this.playerId = playerId;
    this.hasSideEffect = hasSideEffect;
    this.sendToClient = false;
    this.isLegal = true;
  }

  eval() {
    console.log("Base action, do nothing");
  }
}

export class MoveAction extends Action {
  constructor(actionId, playerId, hasSideEffect, currentPosition, chosePosition) {
    super(actionId, playerId, hasSideEffect);
    this.currentPosition = currentPosition;
    this.sendToClient = false;
  }

  eval() {
    if(this.hasSideEffect) {
      return {
        //Update game state on player's position
      }
    }
    dice4 = getRandomIntInclusive(4);
    dice6 = getRandomIntInclusive(6);
    total = dice4+dice6;
    if(total == 7){
      this.sendToClient = true;
    }
    else {
      this.sendToClient = true;
    }
    return {
      sendToClient: this.sendToClient,
      sideEffect: this.sideEffect,
    }
  }
}

export class AttackAction extends Action {
  constructor(actionId, playerId, hasSideEffect, targetId) {
    super(actionId, playerId, hasSideEffect);
    this.targetId = targetId;
    this.sendToClient = false;
  }

  eval() {

  }
}

export class AreaBasedAction extends Action {
}
