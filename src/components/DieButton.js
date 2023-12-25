import React from "react"

export default function DieButton(props) {
    return (
        <div className="die-button">
            <div className="minus-button" onClick={() => props.decrease()}></div>
            <h2 className="die-value">{props.value} ({props.track})</h2>
            <div className="plus-button" onClick={() => props.increase()}></div>
        </div>
    )
}