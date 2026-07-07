import React from "react"
import '../style/player.css'

export default function Player(props) {
    const [isFocused, setIsFocused] = React.useState(false)
    const [value, setValue] = React.useState(props.name)

    function inputChange(event) {
        setValue(event.target.value)
    }

    function handleBlur(event) {
        const nextValue = event.target.value
        setValue(nextValue)
        setIsFocused(false)
        props.nameChange(nextValue, props.num)
    }

    return (
        <div className="player-object">
            {/* this will be where we can add settlements, cities, etc 
                have them correspond to numbers for rolls to keep track of resources    
            */}
            {/* color and optional player name */}
            <input
                type="text"
                className="name-input"
                value={value}
                placeholder={props.name}
                onChange={inputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={handleBlur}
                style={{
                    backgroundColor: isFocused ? "#7a7e7a8f" : "#5b5e5b34"
                }}
            // onKeyDown={(event) => handleEnter(event)}
            />
            <div className="board-info">
                {/* where the settlements, cities, and resource info is going to go */}
                {props.buildings}
            </div>
        </div>



    )
}