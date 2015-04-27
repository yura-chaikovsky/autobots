# Autobots

## Installation

`npm i` (only after code update)

`node server/server`

## Basic usage

1. Connect some bots to the game (open in browser demo bots `ironhide.html` and `optimus.html`
2. Open `localhost:8000` in your browser
3. Press **start**
 
## API

We use http://socket.io/ as a transport

### output

`'registration'` - once after each `'join-game'` request, returns `{ id: * }` string id of your bot

`'state-update'` - each turn after game start, returns `stateData`

### input

`'join-game'` - requires `{ token: * }` you private token (currently just a name)

    fires `'registration'`
    
`'send-commands'` - requires one of next actions:

  `{ action: 'move', options: { direction: 'up', rotation: 'left' } }`
  
    `direction` - moves bot in selected direction    
    `rotation` - sets direction of the cannon
    
  `{ action: 'fire', options: {} }`


## State data format

```
{
  "turn": 157,  // current turn number
  "autobots": [ // array of bots in the game
    {
      "id": "autobot#0",  
      "name": "ironhide",
      "direction": "down",  // **down** means to reduce `Y` coordinate
      "position": {         // `(0, 0)` - is top left corner
        "x": 6,
        "y": 2
      },
      "health": 5   // `0` means bot is dead
    },
    ...
  ],
  "bullets": [
    {
      "id": "bullet#118",
      "direction": "right",
      "position": {
        "x": 6,
        "y": 10
      }
    }
  ],
  "walls": [
    {
      "id": "wall#4",
      "position": {
        "x": 5,
        "y": 1
      },
      "health": 1
    },
    ...
  ]
}
