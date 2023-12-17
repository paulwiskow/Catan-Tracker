import react from "react"
import { nanoid } from 'nanoid'
import './App.css'
import DieButton from "./components/DieButton"
import Player from "./components/Player"

function App() {
  const [player1, setPlayer1] = react.useState({})

  function createPlayer(num) {
    return ({
      playerNum: num,
      name: "",
      resourcesGained: [0, 0, 0, 0, 0], // [wood, brick, sheep, wheat, ore]
      resourcesBlocked: [0, 0, 0, 0, 0], // same format as gained, will use this later
      buildings: [{}, {}, {}, {}, {}],  // Building object, can upgrade into city, keeps track of resources and numbers
    })
  }

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
      }
    )
  }

  const dieElements = numbers.map(num => (
    <DieButton key={nanoid()} value={num} track={tracker[num-1]} increase={() => changeDieValue(num, true)} decrease={() => changeDieValue(num, false)} />
  ))

  return (
    <main>
      <h1>The best catan irl tracker out there I swear</h1>
      <div className="player-container">
        <Player />
        <Player />
      </div>
      <div className="die-container">
        {dieElements}
      </div>
    </main>
  );
}

export default App;
