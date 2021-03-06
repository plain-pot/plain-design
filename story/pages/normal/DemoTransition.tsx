import {designComponent, designPage, reactive} from 'plain-design-composition'
import React from 'react'
import './DemoTransition.scss'
import PlTransition from "../../../src/packages/PlTransition";
import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src/packages/PlButton";
import {PlButtonGroup} from "../../../src/packages/PlButtonGroup";
import {PlInput} from "../../../src/packages/PlInput";

const A = designComponent({
    setup() {
        return {
            render: () => (
                <div>
                    111
                </div>
            )
        }
    },
})
console.log(A.name, typeof A)

export default designPage(() => {
    const state = reactive({
        show: true,
    })
    return () => (
        <div>
            <A/>
            <DemoRow title={'基本用法'}>
                <PlButton label={'switch'} onClick={() => state.show = !state.show}/>
                <br/>
                <br/>
                <PlTransition switch name={'demo-fade'}>
                    <PlButton onClick={() => state.show = !state.show} key={state.show ? 'show' : 'hide'}>
                        {state.show ? "Hello, world!" : "Goodbye, world!"}
                    </PlButton>
                </PlTransition>
            </DemoRow>
            <DemoRow title={'预定义内置的动画'}>
                <div>
                    <PlButton label={'scale'} onClick={() => state.show = !state.show}/>
                    &nbsp;&nbsp;
                    <PlTransition switch name={'pl-transition-scale'}>
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
                    <PlTransition switch name={'pl-transition-scale-y'}>
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
                    <PlTransition switch name={'pl-transition-fade'}>
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
                    <PlTransition switch name={'pl-transition-slide-prev'}>
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
                    <PlTransition switch name={'pl-transition-slide-next'}>
                        {state.show ? (
                            <PlButton label={'on'} status={'success'} key={'on'} {...{direction: 'horizontal'} as any}/>
                        ) : (
                            <PlButton label={'off'} status={'error'} key={'off'} {...{direction: 'horizontal'} as any}/>
                        )}
                    </PlTransition>
                </div>
                <br/>
                <div>
                    <PlButton label={'slide prev (horizontal)'} onClick={() => state.show = !state.show}/>
                    &nbsp;&nbsp;
                    <PlTransition switch name={'pl-transition-slide-prev'}>
                        {state.show ? (
                            <PlButton label={'on'} status={'success'} key={'on'} {...{direction: 'vertical'} as any}/>
                        ) : (
                            <PlButton label={'off'} status={'error'} key={'off'} {...{direction: 'vertical'} as any}/>
                        )}
                    </PlTransition>
                </div>
                <br/>
                <div>
                    <PlButton label={'slide next (horizontal)'} onClick={() => state.show = !state.show}/>
                    &nbsp;&nbsp;
                    <PlTransition switch name={'pl-transition-slide-next'}>
                        {state.show ? (
                            <PlButton label={'on'} status={'success'} key={'on'} {...{direction: 'vertical'} as any}/>
                        ) : (
                            <PlButton label={'off'} status={'error'} key={'off'} {...{direction: 'vertical'} as any}/>
                        )}
                    </PlTransition>
                </div>
            </DemoRow>
            <DemoRow title={'v-if transition'}>
                <PlButtonGroup>
                    <PlButton label={state.show ? 'show' : 'hide'} onClick={() => state.show = !state.show}/>
                    <PlTransition name={'pl-transition-scale-y'} unmount show={state.show}>
                        <PlInput/>
                    </PlTransition>
                    <PlButton label={'next content'} mode={'stroke'}/>
                </PlButtonGroup>
            </DemoRow>
            <DemoRow title={'v-show transition'}>
                <PlButtonGroup>
                    <PlButton label={state.show ? 'show' : 'hide'} onClick={() => state.show = !state.show}/>
                    <PlTransition name={'demo-disappear'} show={state.show}>
                        <PlInput/>
                    </PlTransition>
                    <PlButton label={'next content'} mode={'stroke'}/>
                </PlButtonGroup>
            </DemoRow>
        </div>
    )
})