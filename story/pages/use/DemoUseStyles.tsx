import React, {useState} from "react";
import './DemoUseStyles.scss'

export default function App() {
    const [inProp, setInProp] = useState(false);
    return (
        <div>
            <button type="button" onClick={() => setInProp(!inProp)}>
                Click to Enter
            </button>
        </div>
    );
}