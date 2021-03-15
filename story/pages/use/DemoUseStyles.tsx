import React, {useState} from "react";
import {CSSTransition} from 'react-transition-group'
import './DemoUseStyles.scss'

export default function App() {
    const [inProp, setInProp] = useState(false);
    return (
        <div>
            <button type="button" onClick={() => setInProp(!inProp)}>
                Click to Enter
            </button>
            <CSSTransition
                in={inProp}
                timeout={1000}
                classNames="my-node"
                unmountOnExit
            >
                <div>
                    {"I'll receive my-node-* classes"}-{String(inProp)}
                </div>
            </CSSTransition>
        </div>
    );
}