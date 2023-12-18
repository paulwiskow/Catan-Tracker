import react from "react"
import { CiSquarePlus } from "react-icons/ci";
import { PiHouseSimpleFill } from "react-icons/pi"; // settlement icon
import { RiBuilding3Fill } from "react-icons/ri"; // city icon
import { IconContext } from "react-icons";

export default function Build(props) {
    const [add, setAdd] = react.useState(false)

    function addSettle() {
        setAdd(oldAdd => !oldAdd)
        props.create()
    }

    return (
        <div className="build-container">
            {!add && <p className="build-instruction">Add settlements here</p>}
            {!add && <IconContext.Provider value={{ className: "add-button" }}><CiSquarePlus onClick={() => addSettle()} /></IconContext.Provider>}

            {add && <p>wooooo</p>}
        </div>
    )
}