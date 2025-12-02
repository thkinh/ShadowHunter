- First, we have an action queue that belongs only to gameState, this is good for updating gameState with action Queue 
- We have the s_handlers that handle arriving packets, determine whether it should send a response back to clients
- If s_handlers see a packet that can modify the gameState, it will ask the gameState to update then send updated state to clients.
- However, this approach is not ideal, because we cannot let the game state determine whether we should send a packet or not. We have to send updates to clients as well.
--> The gameState shouldn't own the actionQueue alone, this should be of the server

- We can have an actionQueue that handle both gameState and networking
- By creating a subclass of NetworkingAction, where all the action about sending packages is handled, 
- s_handlers then only handle arriving packets, forward it to actionQueue, actionQueue will know whether an action is followed up by a response to clients



## 10:08 AM

We can decoupling like this:

1. When a player want to move:
  - Player(client) send a packet to server, requesting to move
  - Server (s_handlers) adds a RollDice action into the actionQueue
  - Server (s_handlers) adds a ResponseRollDice action into the actionQueue
  - Server then execute all the actions in the actionQueue which includes a response to player
  - Player(client) then received the response which is a result of a roll dices
  - Player(client) then send another packet to the server, confirming the move
  - Server (s_handlers) adds a MovePlayer(client) action into the actionQueue
  - Server (s_handlers) adds a ResponseMovePlayer(client) action into the actionQueue
  - Server then execute all the actions in the actionQueue, response the player with the updated position
  - Player then apply this new position to his/her

