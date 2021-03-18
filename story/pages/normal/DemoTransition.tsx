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
                <div>
                    <PlButton label={'toggle scale'} onClick={() => state.show = !state.show}/>
                    &nbsp;&nbsp;
                    <PlTransition name={'pl-transition-scale'}>
                        {state.show ? (
                            <PlButton label={'on'} status={'success'} key={'on'}/>
                        ) : (
                            <PlButton label={'off'} status={'error'} key={'off'}/>
                        )}
                    </PlTransition>
                </div>
                <br/>
                <div>
                    <PlButton label={'toggle scale-y'} onClick={() => state.show = !state.show}/>
                    &nbsp;&nbsp;
                    <PlTransition name={'pl-transition-scale-y'}>
                        {state.show ? (
                            <PlButton label={'on'} status={'success'} key={'on'}/>
                        ) : (
                            <PlButton label={'off'} status={'error'} key={'off'}/>
                        )}
                    </PlTransition>
                </div>
                <br/>
                <div>
                    <PlButton label={'toggle fade'} onClick={() => state.show = !state.show}/>
                    &nbsp;&nbsp;
                    <PlTransition name={'pl-transition-fade'}>
                        {state.show ? (
                            <PlButton label={'on'} status={'success'} key={'on'}/>
                        ) : (
                            <PlButton label={'off'} status={'error'} key={'off'}/>
                        )}
                    </PlTransition>
                </div>
            </DemoRow>
        </div>
    )
})