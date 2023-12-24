import react from "react"
import { CiSquarePlus } from "react-icons/ci";
import { PiHouseSimpleFill } from "react-icons/pi"; // settlement icon
import { RiBuilding3Fill } from "react-icons/ri"; // city icon
import { MdOutlineHexagon } from "react-icons/md"; // resource hex
import { IconContext } from "react-icons";

export default function Build(props) {
    const [add, setAdd] = react.useState(false)
    const [resource1, setResource1] = react.useState(false)
    const [resource2, setResource2] = react.useState(false)
    const [resource3, setResource3] = react.useState(false)

    function addSettle() {
        setAdd(oldAdd => !oldAdd)
        props.create()
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

    return (
        <div className="build-container">
            {!add && <p className="build-instruction">Add settlements here</p>}
            {!add && <IconContext.Provider value={{ className: "add-button" }}><CiSquarePlus onClick={() => addSettle()} /></IconContext.Provider>}

            {add && (!props.object.isCity && <IconContext.Provider value={{ className: "house-icon"}}><PiHouseSimpleFill /></IconContext.Provider>)}
            {add && (props.object.isCity && <IconContext.Provider value={{ className: "house-icon"}}><RiBuilding3Fill /></IconContext.Provider>)}
            <div className="resource-container">
                {add && <IconContext.Provider value={{ className: "resource-icon"}}><MdOutlineHexagon onClick={() => {setResource1(oldResource => !oldResource)}}/></IconContext.Provider>}
                {resource1 && <DropdownItems object={props.object} num={1} dropHandler={(num) => dropdownHandler(num)} update={(building) => props.update(building)} />}
            </div>
            <div className="resource-container">
                {add && <IconContext.Provider value={{ className: "resource-icon"}}><MdOutlineHexagon onClick={() => {setResource2(oldResource => !oldResource)}}/></IconContext.Provider>}
                {resource2 && <DropdownItems object={props.object} num={2} dropHandler={(num) => dropdownHandler(num)} update={(building) => props.update(building)} />}
            </div>
            <div className="resource-container">
                {add && <IconContext.Provider value={{ className: "resource-icon"}}><MdOutlineHexagon onClick={() => {setResource3(oldResource => !oldResource)}}/></IconContext.Provider>}
                {resource3 && <DropdownItems object={props.object} num={3} dropHandler={(num) => dropdownHandler(num)} update={(building) => props.update(building)} />}
            </div>
        </div>
    )
}

function DropdownItems(props) {
    // Have it so that after choosing resource, chooses dice roll
    const [resourcePicked, setResourcePicked] = react.useState(false)
    const [resource, setResource] = react.useState(null)
    const [dice, setDice] = react.useState(-1)

    function chooseResource(resource) {
        setResourcePicked(true)
        setResource(resource)
    }

    function chooseRoll(die) {
        setDice(die)
        setResourcePicked(false)
        props.dropHandler(props.num)

        let newBuilding = {
            index: props.object.index,
            isCity: props.object.isCity,
            diceRoll: props.object.diceRoll,
        }
        newBuilding.diceRoll[resource] = die
        props.update(newBuilding)
    }

    return (
        <div className="dropdown-menu">
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