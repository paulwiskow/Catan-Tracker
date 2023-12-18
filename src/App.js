import react from "react"
import { nanoid } from 'nanoid'
import './App.css'
import DieButton from "./components/DieButton"
import Player from "./components/Player"

function App() {
  const [players, setPlayers] = react.useState([createPlayer(1), createPlayer(2), createPlayer(3), createPlayer(4)])

  function createPlayer(num) {
    return ({
      playerNum: num,
      name: `Player ${num}`,
      resourcesGained: [0, 0, 0, 0, 0], // [wood, brick, sheep, wheat, ore]
      resourcesBlocked: [0, 0, 0, 0, 0], // same format as gained, will use this later
      buildings: [{}],  // Building objects, can upgrade into city, keeps track of resources and numbers
    })
  }

  function handlePlayerState(num, newResGained, newResBlocked, newBuildings) {
    setPlayers(oldPlayers => oldPlayers.map(player => {
      if (player.playerNum === num) {
        console.log("working")
        return { ...player, resourcesGained: newResGained, resourcesBlocked: newResBlocked, buildings: newBuildings}
      }

      return player
    }))
  }

  function changeName(newName, num) {
    setPlayers(oldPlayers => oldPlayers.map(player => {
      if (player.playerNum === num) {
        return { ...player, name: newName}
      }

      return player
    }))
  }

  const playerComponents = players.map((player) => <Player 
                                                      resGained={player.resourcesGained} 
                                                      resBlocked={player.resourcesBlocked} 
                                                      buildings={player.buildings} 
                                                      num={player.num} 
                                                      name={player.name}  
                                                      nameChange={changeName} 
                                                      stateChange={handlePlayerState}
                                                    />
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
            } else if (increase) {
              newArr[i] += 1
            }
            break
          }
        }
        return newArr
    })
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
