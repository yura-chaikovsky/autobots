# Autobots

## Installation

`npm i` (only after code update)

`node server/server`

## Basic usage

1. Connect some bots to the game (open in browser demo bots `ironhide.html` and `optimus.html`
2. Open `localhost:8000` in your browser
3. Select at least 2 players in the list
4. Press **start**
 
## Config

Game configs are set in `server/config.json`

## API

We use http://socket.io/ as a transport

### input

`'join-game'` - requires `{ token: * }` you private token (currently just a name)
  
  You should enter the game before it has started. Server will fire `'registration'` event
    
`'send-commands'` - allows you to send one of the next commands to your bot

  `{ action: 'move', options: { direction: 'up', rotation: 'left' } }`
  
    Moves your bot in selected `direction` and turns his cannon in `rotation` direction
    
  `{ action: 'fire', options: {} }`
  
    Fires a bullet in current direction of your cannon
    
### output

`'registration'` - once after each `'join-game'` request, returns `{ playerId: * }` string

  Sends you `playerId` to track your bot by. `bot.playerId === playerId`

`'state-update'` - each turn after game start

  Sends state data in the format given further


## State data format

```
{
  "turn": 157,  // current turn number
  "autobots": [ // array of bots in the game
    {
      "id": "autobot#0",
      "playerId": "player#0",
      "name": "ironhide",
      "direction": "down",  // **down** means to reduce `Y` coordinate
      "health": 5,          // `0` means bot is dead
      "position": {         // `(0, 0)` - is top left corner
        "x": 6,
        "y": 2
      },
      "busyCount": 2        // bot can't move for 2 next turns
    },
    ...
  ],
  "bullets": [
    {
      "id": "bullet#118",
      "direction": "right",
      "health": 1
      "position": {
        "x": 6,
        "y": 10
      },
      "busyCount": 0
    }
  ],
  "walls": [
    {
      "id": "wall#4",
      "position": {
        "x": 5,
        "y": 1
      },
      "health": 2
    },
    ...
  ]
}
