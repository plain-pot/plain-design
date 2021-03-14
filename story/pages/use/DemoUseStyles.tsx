import React, {useState} from "react";
import {CSSTransition} from 'react-transition-group'

export default function App() {
    const [inProp, setInProp] = useState(false);
    return (
        <div>
            <CSSTransition in={inProp} timeout={200} classNames="my-node">
                <div>
                    {"I'll receive my-node-* classes"}
                </div>
            </CSSTransition>
            <button type="button" onClick={() => setInProp(true)}>
                Click to Enter
            </button>
        </div>
    );
}