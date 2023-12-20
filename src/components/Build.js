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

    

    return (
        <div className="build-container">
            {!add && <p className="build-instruction">Add settlements here</p>}
            {!add && <IconContext.Provider value={{ className: "add-button" }}><CiSquarePlus onClick={() => addSettle()} /></IconContext.Provider>}

            {add && (!props.object.isCity && <IconContext.Provider value={{ className: "house-icon"}}><PiHouseSimpleFill /></IconContext.Provider>)}
            {add && (props.object.isCity && <IconContext.Provider value={{ className: "house-icon"}}><RiBuilding3Fill /></IconContext.Provider>)}
            <div className="resource-container">
                {add && <IconContext.Provider value={{ className: "resource-icon"}}><MdOutlineHexagon onClick={() => {setResource1(oldResource => !oldResource)}}/></IconContext.Provider>}
                {resource1 && <div className="dropdown-menu">
                    <DropdownItems />
                </div>}
            </div>
            <div className="resource-container">
                {add && <IconContext.Provider value={{ className: "resource-icon"}}><MdOutlineHexagon onClick={() => {setResource2(oldResource => !oldResource)}}/></IconContext.Provider>}
                {resource2 && <div className="dropdown-menu">
                    <DropdownItems />
                </div>}
            </div>
            <div className="resource-container">
                {add && <IconContext.Provider value={{ className: "resource-icon"}}><MdOutlineHexagon onClick={() => {setResource3(oldResource => !oldResource)}}/></IconContext.Provider>}
                {resource3 && <div className="dropdown-menu">
                    <DropdownItems />
                </div>}
            </div>
        </div>
    )
}

function DropdownItems(props) {
    // Have it so that after choosing resource, chooses dice roll

    return (
        <ul>
            <li>
                <p>Wood</p>
            </li>
            <li>
                <p>Brick</p>
            </li>
            <li>
                <p>Sheep</p>
            </li>
            <li>
                <p>Wheat</p>
            </li>
            <li>
                <p>Ore</p>
            </li>
        </ul>
    )
}