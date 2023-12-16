import React from "react"

export default function DieButton(props) {
    return (
        <div className="die-button" onClick={props.update}>
            <h2>{props.value} ({props.track})</h2>
        </div>
    )
}