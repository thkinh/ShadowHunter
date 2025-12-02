import { shuffle } from "../utils.js";
import {createPlayer} from "./player.js"
import { GameBoard } from "./board.js"

export class GameState {
  constructor(totalPlayers, turn = 0, round = 0) {
    const { whiteCards, blackCards, hermitCards } = this.generateRandomCards();
    this.isOver = false;
    this.whiteDeck = whiteCards;
    this.blackDeck = blackCards;
    this.hermitDeck = hermitCards;
    this.decks = new Map(); 
    this.decks.set("White", this.whiteDeck);
    this.decks.set("Black", this.blackDeck);
    this.decks.set("Hermit", this.hermitDeck);
    this.gameBoard = new GameBoard();
    this.totalPlayers = totalPlayers;
    this.players = new Map(); 
    this.maxPlayer = 8;
    this.turn = turn;
    this.round = round;
    this.dices = [0,0]
  }

  generateRandomCards() {
    let base_index = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    const whiteCards = shuffle([...base_index]);
    const blackCards = shuffle([...whiteCards]);
    const hermitCards = shuffle([...blackCards]);

    return { whiteCards, blackCards, hermitCards };
  }

  update(changes) {
    for(const change in changes){
      if(change == 'players'){

        continue;
      }
      this[change] = changes[change];
    }
  }

  updateTurn() {
    this.turn++;
  }
  
  addPlayer(id) {
    this.players.set(id, createPlayer(id));
    return this.players.get(id);
  }

  drawCard(type) {
    drawDeck = this.decks.get(type);
    return drawDeck.pop();
  }

  getPlayer(id) {
    return this.players.get(id);
  }
}


//test
const start  = performance.now();
const gameState = new GameState(6, 0 ,0);
gameState.addPlayer(2008);
const end = performance.now();
console.log(`Execution time: ${end - start} ms`);
