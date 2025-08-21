const btn_Next = document.getElementById("btn_Next");
const playersContainer = document.querySelectorAll(".player");
let current_player = 0;
const players = Array.from(playersContainer)

btn_Next.addEventListener("click", ()=> {
  event.preventDefault();
  players[current_player].style.backgroundColor = "green";
  console.log(`set ${current_player} background to green`);
  const last_player = current_player === 0 ? 5 : current_player - 1;
  players[last_player].style.backgroundColor = "red";
  console.log(`set ${last_player}  to red`);
  current_player = current_player === 5? 0 : current_player+1; 
})
