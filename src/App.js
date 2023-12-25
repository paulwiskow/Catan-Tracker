import react from "react"
import { nanoid } from 'nanoid'
import './App.css'
import DieButton from "./components/DieButton"
import Player from "./components/Player"

function App() {
  const [players, setPlayers] = react.useState(() => createPlayerArray())

  function createPlayerArray() {
    const temp = []
    for(let i = 0; i < 4; i++) {
      temp.push(createPlayer(i+1))
    }

    return temp
  }

  function createPlayer(num) {
    return ({
      playerNum: num,
      name: `Player ${num}`,
      resourcesGained: [0, 0, 0, 0, 0], // [wood, brick, sheep, wheat, ore]
      resourcesBlocked: [0, 0, 0, 0, 0], // same format as gained, will use this later
      buildings: [null],  // Building objects, can upgrade into city, keeps track of resources and numbers
    })
  }

  function handlePlayerState(num, newResGained, newResBlocked, newBuildings) {
    setPlayers(oldPlayers => oldPlayers.map(player => {
      if (player.playerNum === num) {
        return Object.assign(player, {resourcesGained: newResGained, resourcesBlocked: newResBlocked, buildings: newBuildings})
      }

      
      return player
    }))
  }

  function changeName(newName, num) {
    setPlayers(oldPlayers => oldPlayers.map(player => {
      if (player.playerNum === num) {
        return Object.assign(player, {name: newName})
      }

      return player
    }))
  }

  const playerComponents = players.map((player) => {
      return <Player 
              resGained={player.resourcesGained} 
              resBlocked={player.resourcesBlocked} 
              buildings={player.buildings} 
              num={player.playerNum} 
              name={player.name}  
              nameChange={(newName, num) => changeName(newName, num)} 
              stateChange={(num, newResGained, newResBlocked, newBuildings) => handlePlayerState(num, newResGained, newResBlocked, newBuildings)}
             />
    }
  )

  const [tracker, setTracker] = react.useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  function changeDieValue(num, increase) {
    setTracker(oldTracker => {
      let newArr = Array.from(oldTracker)
        for(let i = 0; i < oldTracker.length; i++) {
          if (i === num - 1) {
            if (newArr[i] > 0 && !increase){
              newArr[i] -= 1
              trackResources(num, false)
            } else if (increase) {
              newArr[i] += 1
              trackResources(num, true)
            }
            console.log("being called twice")
            break
          }
        }
        return newArr
    })
  }

  function trackResources(dieNum, increment) {
      for (const player of players) {
          for (const building of player.buildings) {
              if (building === null) {
                  break
              } else {
                  for (let resource in building.diceRoll) {
                      if (building.diceRoll[resource] === dieNum) {
                          if (building.isCity) {
                              if (increment) {
                                  player.resourcesGained[convertResourceToIndex(resource)] += 2
                              } else {
                                  player.resourcesGained[convertResourceToIndex(resource)] -= 2
                              }
                              
                          } else {
                            if (increment) {
                                player.resourcesGained[convertResourceToIndex(resource)] += 1
                            } else {
                                player.resourcesGained[convertResourceToIndex(resource)] -= 1
                            }
                          }
                          handlePlayerState(player.num, player.resGained, player.resBlocked, player.buildings)
                      }
                  }
              }
          }

          // console.log(player)
      }
  }

  function convertResourceToIndex(resource) {
    if (resource === "wood") {
        return 0
    } else if (resource === "brick") {
        return 1
    } else if (resource === "sheep") {
        return 2
    } else if (resource === "wheat") {
        return 3
    } else {
        return 4
    }
  }

  const dieElements = numbers.map(num => (
    <DieButton key={nanoid()} value={num} track={tracker[num-1]} increase={() => changeDieValue(num, true)} decrease={() => changeDieValue(num, false)} />
  ))

  return (
    <main>
      <h1>The best catan irl tracker out there I swear</h1>
      <div className="player-container">
        {playerComponents}
      </div>
      <div className="die-container">
        {dieElements}
      </div>
    </main>
  );
}

export default App;
