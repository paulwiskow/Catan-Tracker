import React from "react"
import { FaEdit } from "react-icons/fa";

export default function Player(props) {
    const [type, setType] = React.useState(true)
    const [value, setValue] = React.useState(props.name)
    function click() {
        setType(oldType => !oldType)
        if (!type) {
            props.nameChange(value, props.num)
        }
    }

    function inputChange(event) {
        setValue(oldValue => event.target.value)
    }

    return (
        <div className="player-object">
            {/* this will be where we can add settlements, cities, etc 
                have them correspond to numbers for rolls to keep track of resources    
            */}
            <div className="player-info">
            {/* color and optional player name */}
                <input type="text" className="name-input" placeholder={props.name} readOnly={type} onChange={(event) => inputChange(event)} />
                <button className="name-button" onClick={() => click()} >
                    <FaEdit />
                </button>
            </div>
            <div className="board-info">
            {/* where the settlements, cities, and resource info is going to go */}
                <p>add settlements and cities</p>
            </div>
        </div>
    )
}