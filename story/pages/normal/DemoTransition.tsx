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
                    <PlButton label={'scale'} onClick={() => state.show = !state.show}/>
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
                    <PlButton label={'scale-y'} onClick={() => state.show = !state.show}/>
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
                    <PlButton label={'fade'} onClick={() => state.show = !state.show}/>
                    &nbsp;&nbsp;
                    <PlTransition name={'pl-transition-fade'}>
                        {state.show ? (
                            <PlButton label={'on'} status={'success'} key={'on'}/>
                        ) : (
                            <PlButton label={'off'} status={'error'} key={'off'}/>
                        )}
                    </PlTransition>
                </div>
                <br/>
                <div>
                    <PlButton label={'slide prev (horizontal)'} onClick={() => state.show = !state.show}/>
                    &nbsp;&nbsp;
                    <PlTransition name={'pl-transition-slide-prev'}>
                        {state.show ? (
                            <PlButton label={'on'} status={'success'} key={'on'} {...{direction: 'horizontal'} as any}/>
                        ) : (
                            <PlButton label={'off'} status={'error'} key={'off'} {...{direction: 'horizontal'} as any}/>
                        )}
                    </PlTransition>
                </div>
                <br/>
                <div>
                    <PlButton label={'slide next (horizontal)'} onClick={() => state.show = !state.show}/>
                    &nbsp;&nbsp;
                    <PlTransition name={'pl-transition-slide-next'}>
                        {state.show ? (
                            <PlButton label={'on'} status={'success'} key={'on'} {...{direction: 'horizontal'} as any}/>
                        ) : (
                            <PlButton label={'off'} status={'error'} key={'off'} {...{direction: 'horizontal'} as any}/>
                        )}
                    </PlTransition>
                </div>
            </DemoRow>
        </div>
    )
})