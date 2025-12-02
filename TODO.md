# TODO
- [X] Server, Client
- [ ] Player
- [ ] Game State
- [ ] Server should know about the game state
- [ ] Client only read update GameState --> Clients should know about what actions server did, the MessageType.SERVER_RESPONSE_ROLLDICE is wrong.


# GAMELOOP
Player0's turn --> Player0 use skills or items --> Player0 roll dices for movement --> Player0 move --> Player0 draw a card from decks that based on the current position --> Player0 attacks other players (if available in the zone) --> Player0's turn ends --> Player1's turn --> Player1 use skills or item



TURN UPDATE --> SKILLS OR ITEM --> ROLL DICES --> MOVE --> DRAW A CARD --> ATTACKS

function{
  GameState.isOver = false;
  
  
  while(!GameState.isOver){
    TurnUpdate(); --> Recieve updtae packet from server
    SkillsAndItem(); --> Client use skills or items --> Send packet useSkills(useItem) to server
    RollDices(); --> Server response with dices results 
    Move(); --> Both Server and Client update their player position on dices accordingly
    DrawCard(); --> Client choose to draw a card from which decks, send that decision to server, then server respond with the coresponding card, then send update packet to all clients
    Attacks(); --> Client send attack packet to server, server update health on whoever get attacked, and send back the update packet to all clients.
  }
}

# TODOLIST 9/9/25
- Implement Action Queue !DONE
- Implement Characters   
- Implement Win Conditions --> checkWinCondition(); Each Action added to ActionQueue must have its property of isAffectingWinCondition --> if has then it must call WinCondition(this Action) to check after execute that action.
