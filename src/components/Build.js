import react from "react"
import { CiSquarePlus } from "react-icons/ci";
import { PiHouseSimpleFill } from "react-icons/pi"; // settlement icon - EVENTUALLY add colors and actual colored icons, can get images from https://github.com/riteshsp2000/cards-tracker-catan/blob/master/src/img/cards/card_wool.svg
import { RiBuilding3Fill } from "react-icons/ri"; // city icon
import { MdOutlineHexagon } from "react-icons/md"; // resource hex
import { IconContext } from "react-icons";
import '../style/player.css'
import '../style/dropdown.css'

export default function Build(props) {
    const [resource1, setResource1] = react.useState(false)
    const [resource2, setResource2] = react.useState(false)
    const [resource3, setResource3] = react.useState(false)

    const [style1, setStyle1] = react.useState({ backgroundColor: "#dabf6c" })
    const [style2, setStyle2] = react.useState({ backgroundColor: "#dabf6c" })
    const [style3, setStyle3] = react.useState({ backgroundColor: "#dabf6c" })

    const [die1, setDie1] = react.useState("")
    const [die2, setDie2] = react.useState("")
    const [die3, setDie3] = react.useState("")

    const woodColor = "#3ecd21"
    const brickColor = "#ce866d"
    const sheepColor = "#9fe21b"
    const wheatColor = "#e8b339"
    const oreColor = "#a2c9bc"

    function addSettle() {
        props.create()
    }

    function toggleCity() {
        props.update(Object.assign(props.object, { isCity: !props.object.isCity }))
    }

    function dropdownHandler(num) {
        if (num === 1) {
            setResource1(false)
        } else if (num === 2) {
            setResource2(false)
        } else {
            setResource3(false)
        }
    }

    function changeHexColor(building, num, resource, die) {
        if (num === 1) {
            setStyle1(oldStyle => Object.assign(oldStyle, {backgroundColor: chooseResource(resource)}))
            setDie1(`${die}`)
        } else if (num === 2) {
            setStyle2(oldStyle => Object.assign(oldStyle, {backgroundColor: chooseResource(resource)}))
            setDie2(`${die}`)
        } else {
            setStyle3(oldStyle => Object.assign(oldStyle, {backgroundColor: chooseResource(resource)}))
            setDie3(`${die}`)
        }

        props.update(building)
    }

    function chooseResource(resource) {
        if (resource === "wood") {
            return woodColor
        } else if (resource === "brick") {
            return brickColor
        } else if (resource === "sheep") {
            return sheepColor
        } else if (resource === "wheat") {
            return wheatColor
        } else {
            return oreColor
        }
    }

    return (
        <div className="build-container">
            {!props.object && <p className="build-instruction">Add settlements here</p>}
            {!props.object && <IconContext.Provider value={{ className: "add-button" }}><CiSquarePlus onClick={() => addSettle()} /></IconContext.Provider>}

            {props.object && (!props.object.isCity && <IconContext.Provider value={{ className: "house-icon"}}><PiHouseSimpleFill onClick={() => toggleCity()} /></IconContext.Provider>)}
            {props.object && (props.object.isCity && <IconContext.Provider value={{ className: "house-icon"}}><RiBuilding3Fill onClick={() => toggleCity()} /></IconContext.Provider>)}
            <div className="resource-container">
                {props.object && <IconContext.Provider value={{ className: "resource-icon"}}><MdOutlineHexagon style={style1} onClick={() => {setResource1(oldResource => !oldResource)}}/></IconContext.Provider>}
                {props.object && <p className="show-die" onClick={() => {setResource1(oldResource => !oldResource)}}>{die1}</p>}
            </div>
            {resource1 && <DropdownItems object={props.object} num={1} dropHandler={(num) => dropdownHandler(num)} update={(building, resource, die) => changeHexColor(building, 1, resource, die)} />}
            <div className="resource-container">
                {props.object && <IconContext.Provider value={{ className: "resource-icon"}}><MdOutlineHexagon style={style2} onClick={() => {setResource2(oldResource => !oldResource)}}/></IconContext.Provider>}
                {props.object && <p className="show-die" onClick={() => {setResource2(oldResource => !oldResource)}}>{die2}</p>}
            </div>
            {resource2 && <DropdownItems object={props.object} num={2} dropHandler={(num) => dropdownHandler(num)} update={(building, resource, die) => changeHexColor(building, 2, resource, die)} />}
            <div className="resource-container">
                {props.object && <IconContext.Provider value={{ className: "resource-icon"}}><MdOutlineHexagon style={style3} onClick={() => {setResource3(oldResource => !oldResource)}}/></IconContext.Provider>}
                {props.object && <p className="show-die" onClick={() => {setResource3(oldResource => !oldResource)}}>{die3}</p>}
            </div>
            {resource3 && <DropdownItems object={props.object} num={3} dropHandler={(num) => dropdownHandler(num)} update={(building, resource, die) => changeHexColor(building, 3, resource, die)} />}
        </div>
    )
}

function DropdownItems(props) {
    // Have it so that after choosing resource, chooses dice roll
    const [resourcePicked, setResourcePicked] = react.useState(false)
    const [resource, setResource] = react.useState(null)

    const style = {
        gridColumnStart: `${props.num + 1}`,
        gridColumnEnd: `${props.num + 2}`,
        gridRowStart: "1"
    }

    function chooseResource(resource) {  // currently will only update after choosing roll, can't just choose resource
        setResourcePicked(true)
        setResource(resource)
    }

    function chooseRoll(die) {
        setResourcePicked(false)
        props.dropHandler(props.num)

        let newBuilding = {
            index: props.object.index,
            isCity: props.object.isCity,
            diceRoll: props.object.diceRoll,
        }
        newBuilding.diceRoll[resource] = die
        props.update(newBuilding, resource, die)
    }

    return (
        <div className="dropdown-menu" style={style}>
            {!resourcePicked && 
            <ul>
                <li>
                    <button className="resource-buttons left-buttons" onClick={() => chooseResource("wood")}>Wood</button> <button className="resource-buttons right-buttons" onClick={() => chooseResource("brick")}>Brick</button>
                </li>
                <li>
                    <button className="resource-buttons left-buttons" onClick={() => chooseResource("sheep")}>Sheep</button> <button className="resource-buttons right-buttons" onClick={() => chooseResource("wheat")}>Wheat</button>
                </li>
                <li>
                    <button className="resource-buttons left-buttons" onClick={() => chooseResource("ore")}>Ore</button>
                </li>
            </ul>}
            {resourcePicked && 
            <ul>
                <li>
                    <button className="number-buttons left-buttons" onClick={() => chooseRoll(2)}>2</button>
                </li>
                <li>
                    <button className="number-buttons left-buttons" onClick={() => chooseRoll(3)}>3</button> <button className="number-buttons right-buttons" onClick={() => chooseRoll(4)}>4</button>
                </li>
                <li>
                    <button className="number-buttons left-buttons" onClick={() => chooseRoll(5)}>5</button> <button className="number-buttons right-buttons" onClick={() => chooseRoll(6)}>6</button>
                </li>
                <li>
                    <button className="number-buttons left-buttons" onClick={() => chooseRoll(7)}>7</button> <button className="number-buttons right-buttons" onClick={() => chooseRoll(8)}>8</button>
                </li>
                <li>
                    <button className="number-buttons left-buttons" onClick={() => chooseRoll(9)}>9</button> <button className="number-buttons right-buttons" onClick={() => chooseRoll(10)}>10</button>
                </li>
                <li>
                    <button className="number-buttons left-buttons" onClick={() => chooseRoll(11)}>11</button> <button className="number-buttons right-buttons" onClick={() => chooseRoll(12)}>12</button>
                </li>
            </ul>}
        </div>
        
    )
}