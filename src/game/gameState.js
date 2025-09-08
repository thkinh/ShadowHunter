import { shuffle } from "../utils.js";

class GameState {
  constructor(totalPlayers, turn = 0, round = 0) {
    const { whiteCards, blackCards, hermitCards } = this.generateRandomCards();
    this.isOver = false;
    this.whiteCards = whiteCards;
    this.blackCards = blackCards;
    this.hermitCards = hermitCards;
    this.totalPlayers = totalPlayers;
    this.turn = turn;
    this.round = round;
  }

  generateRandomCards() {
    let base_index = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
    const whiteCards = shuffle([...base_index]);
    const blackCards = shuffle([...whiteCards]);
    const hermitCards = shuffle([...blackCards]);

    return { whiteCards, blackCards, hermitCards };
  }

  updateState() {
    this.turn++;
  }

}
