import { getRandomIntInclusive } from "./../utils.js"

export function createPlayer(id, role, maxHP, hp = maxHP, items = []) {
  role  = role  ?? randomRole();
  maxHP = maxHP ?? 100;
  hp    = hp    ?? maxHP;
  items = items ?? [];

  return {
    id,
    role,
    maxHP,
    hp,
    items,

    showInfo() {
      console.log(`Role: ${this.role}`);
      console.log(`HP: ${this.hp}/${this.maxHP}`);
      console.log(`Items: ${this.items.length > 0 ? this.items.join(", ") : "None"}`);
    }
  };
}


const roleList = ["Shadow", "Hunter", "Neutral"]
function randomRole(){
  const index = getRandomIntInclusive(0,2) ;
  return roleList[index];
}

