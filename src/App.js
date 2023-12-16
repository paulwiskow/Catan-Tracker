import react from "react"
import { nanoid } from 'nanoid'
import './App.css'
import DieButton from "./components/DieButton"

function App() {
  const [tracker, setTracker] = react.useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  function updateDieValue(num) {
    setTracker(oldTracker => {
      let newArr = Array.from(oldTracker)
        for(let i = 0; i < oldTracker.length; i++) {
          if (i === num - 1) {
            newArr[i] += 1
            break
          }
        }
        return newArr
      }
    )
  }

  const dieElements = numbers.map(num => (
    <DieButton key={nanoid()} value={num} track={tracker[num-1]} update={() => updateDieValue(num)}/>
  ))

  return (
    <main>
      <h1>The best catan irl tracker out there I swear</h1>
      <div className="die-container">
        {dieElements}
      </div>
    </main>
  );
}

export default App;
