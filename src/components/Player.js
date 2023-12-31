import React from "react"
import { FaEdit } from "react-icons/fa";
import Build from "./Build";
import '../style/player.css'

export default function Player(props) {
    const [type, setType] = React.useState(true)
    const [value, setValue] = React.useState(props.name)
    const [buildings, setBuildings] = React.useState([{}]) // create two unique states for buildings that are in sync with one another, one here and one in parent - so we can render the buildings here and still have the data in the parent so we can possibly make a graph later
    const inputRef = React.useRef(null)

    function createNewBuilding() {
        const diceMap = new Map()
        diceMap["wood"] = -1 // dice roll
        diceMap["brick"] = -1
        diceMap["sheep"] = -1
        diceMap["wheat"] = -1
        diceMap["ore"] = -1

        let newBuilding = {
            index: props.buildings.length - 1,
            isCity: false,
            diceRoll: diceMap,
        }
        let tempArr = Array.from(buildings)
        tempArr[tempArr.length - 1] = newBuilding
        if (tempArr.length !== 9) {
            tempArr.push(null)
        }
        

        setBuildings(tempArr)
        props.stateChange(props.num, props.resGained, props.resBlocked, tempArr)
    }

    function updateBuilding(building) {
        setBuildings(oldArr => {
            let temp = Array.from(oldArr)
            temp[building.index] = building

            return temp
        })

        props.stateChange(props.num, props.resGained, props.resBlocked, buildings)
    }

    const buildingComponents = buildings.map(building => {
        return <Build object={building} create={() => createNewBuilding()} update={(building) => updateBuilding(building)} />
    })

    function changeName(event) {
        setType(oldType => !oldType)
        if (!type) {
            props.nameChange(value, props.num)
        } else {
            inputRef.current.focus()
        }
    }

    function inputChange(event) {
        setValue(oldValue => event.target.value)
    }

    function handleEnter(event) {
        if (event.key === "Enter") {
            changeName(event)
        }
    }

    const styles = {
        cursor: type ? "default" : "text",
        backgroundColor: type ? "#5b5e5b34" : "#7a7e7a8f"
    }

    return (
        <div className="player-object">
            {/* this will be where we can add settlements, cities, etc 
                have them correspond to numbers for rolls to keep track of resources    
            */}
            <div className="player-info">
            {/* color and optional player name */}
                <input 
                    type="text" 
                    style={styles} 
                    className="name-input" 
                    placeholder={props.name} 
                    readOnly={type} 
                    onChange={(event) => inputChange(event)} 
                    ref={inputRef} 
                    onKeyDown={(event) => handleEnter(event)}
                />
                <button className="name-button" onClick={(event) => changeName(event)} >
                    <FaEdit />
                </button>
            </div>
            <div className="board-info">
            {/* where the settlements, cities, and resource info is going to go, each player has their own array of "Build" objects that we add (or remove eventually) from */}
                {buildingComponents}
            </div>
        </div>
    )
}