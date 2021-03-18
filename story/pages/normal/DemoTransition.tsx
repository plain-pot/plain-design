import {designPage, reactive} from 'plain-design-composition'
import React from 'react'
import './DemoTransition.scss'
import PlTransition from "../../../src/packages/PlTransition";
import {PlButton} from "../../../src";

export default designPage(() => {
    const state = reactive({
        show: true,
    })
    return () => (
        <div>
            <button onClick={() => state.show = !state.show}>
                {state.show ? "Hello, world!" : "Goodbye, world!"}
            </button>
            <br/>
            <br/>
            {/*<PlTransition name={'fade'}>
                <PlButton key={state.show ? 'show' : 'hide'} onClick={() => state.show = !state.show}>
                    {state.show ? "Hello, world!" : "Goodbye, world!"}
                </PlButton>
            </PlTransition>
            <br/>
            <br/>*/}
            <PlTransition name={'pl-transition-scale'} k={state.show ? 'show' : 'hide'}>
                <PlButton key={state.show ? 'show' : 'hide'} onClick={() => state.show = !state.show}>
                    {state.show ? "Hello, world!" : "Goodbye, world!"}
                </PlButton>
            </PlTransition>
        </div>
    )
})