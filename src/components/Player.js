import React from "react"
import { FaEdit } from "react-icons/fa";
import '../style/player.css'

export default function Player(props) {
    const [type, setType] = React.useState(true)
    const [value, setValue] = React.useState(props.name)
    const inputRef = React.useRef(null)

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
            {/* where the settlements, cities, and resource info is going to go */}
                {props.buildings}
            </div>
        </div>
    )
}