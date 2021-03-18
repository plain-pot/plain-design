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
            <PlTransition name={'fade'}>
                <PlButton key={state.show ? 'show' : 'hide'} onClick={() => state.show = !state.show}>
                    {state.show ? "Hello, world!" : "Goodbye, world!"}
                </PlButton>
            </PlTransition>
        </div>
    )
})