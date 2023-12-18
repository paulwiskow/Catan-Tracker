import react from "react"
import { CiSquarePlus } from "react-icons/ci";
import { IconContext } from "react-icons";

export default function Build() {
    const [add, setAdd] = react.useState(false)

    function addSettle() {
        setAdd(oldAdd => !oldAdd)
    }

    return (
        <div className="build-container">
            {!add && <p className="build-instruction">Add settlements here</p>}
            {!add && <IconContext.Provider value={{ className: "add-button" }}><CiSquarePlus onClick={() => addSettle()} /></IconContext.Provider>}

            
        </div>
    )
}