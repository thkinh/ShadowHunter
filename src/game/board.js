export class GameBoard {
  //Add Actions to area9 and area10
  constructor(){
    this.areas = new Map();
    this.areas.set(2 , new GameArea("Hermit's Cabin"   , 2 ,  ["Hermit"]))
    this.areas.set(3 , new GameArea("Hermit's Cabin"   , 3 ,  ["Hermit"]))
    this.areas.set(4 , new GameArea("Underworld Gate"  , 4 ,  ["Hermit", "White", "Black"]))
    this.areas.set(5 , new GameArea("Underworld Gate"  , 5 ,  ["Hermit", "White", "Black"]))
    this.areas.set(6 , new GameArea("Church"           , 6 ,  ["White"]))
    this.areas.set(8 , new GameArea("Cemetery"         , 8 ,  ["Black"]))
    this.areas.set(9 , new GameArea("Weird Woods"      , 9 ,  []))
    this.areas.set(10, new GameArea("Erstwhile Altar"  , 10,  []))
  }
}

class GameArea {
  static ATTACK_RANGES = {
    2: [2, 3, 4, 5],
    3: [2, 3, 4, 5],
    4: [2, 3, 4, 5],
    5: [2, 3, 4, 5],
    6: [6, 9],
    9: [6, 9],
    8: [8, 10],
    10: [8, 10],
  };

  constructor(name = "NULL", coordinates = 1, areaDecks = [], description = "NULL"){
    this.name = name;
    this.description = description;
    this.coordinates = coordinates;
    this.areaDecks = areaDecks;
    this.attackRange = GameArea.ATTACK_RANGES[coordinates] || [];
  }
}


const board  = new GameBoard();
console.log(board.areas);

