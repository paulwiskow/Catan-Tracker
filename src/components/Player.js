import React from "react"

export default function Player(props) {
    return (
        <div className="player-object">
            {/* this will be where we can add settlements, cities, etc 
                have them correspond to numbers for rolls to keep track of resources    
            */}
            <div className="player-info">
            {/* color and optional player name */}
                <p>player icon and name</p>
            </div>
            <div className="board-info">
            {/* where the settlements, cities, and resource info is going to go */}
                <p>add settlements and cities</p>
            </div>
        </div>
    )
}