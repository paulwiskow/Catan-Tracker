import '../style/dice.css'

export default function DieButton(props) {
    return (
        <div className="die-button-container">
            <button className="die-button" onClick={() => props.increase(props.value, true)}>{props.value} ({props.track})</button>
        </div>
    )
}