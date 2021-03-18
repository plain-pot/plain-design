import {designPage, reactive} from 'plain-design-composition'
import React from 'react'
import './DemoTransition.scss'
import PlTransition from "../../../src/packages/PlTransition";
import {PlButton} from "../../../src";
import {DemoRow} from "../../components/DemoRow";

export default designPage(() => {
    const state = reactive({
        show: true,
    })
    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'switch'} onClick={() => state.show = !state.show}/>
                <br/>
                <br/>
                <PlTransition name={'demo-fade'}>
                    <PlButton onClick={() => state.show = !state.show} key={state.show ? 'show' : 'hide'}>
                        {state.show ? "Hello, world!" : "Goodbye, world!"}
                    </PlButton>
                </PlTransition>
            </DemoRow>
            <DemoRow title={'预定义内置的动画'}>
                <PlButton label={'switch'} onClick={() => state.show = !state.show}/>
                <br/>
                <br/>
                <PlTransition name={'pl-transition-scale'}>
                    <PlButton key={state.show ? 'show' : 'hide'}>
                        {state.show ? "Hello, world!" : "Goodbye, world!"}
                    </PlButton>
                </PlTransition>
            </DemoRow>
        </div>
    )
})