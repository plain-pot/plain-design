import {designComponent} from "plain-design-composition";
import React from "react";
import {reactive} from "@vue/reactivity";
import useClass from "plain-design-composition/src/use/useClasses";
import './DemoUseSlots.scss'

const DemoUseSlotsComponent = designComponent({
    props: {
        text: {type: String},
    },
    slots: [
        'head',
        'foot',
        'default',
    ],
    setup({props, slots}) {
        const classes = useClass(() => [
            'demo-use-slots-component',
            {
                'demo-use-slots-component-has-slot-head': slots.head.isExist()
            }
        ])
        return {
            render() {
                console.log('render')
                return (
                    <div className={classes.value}>
                        <div className="demo-use-slots-component-head">
                            this is head:
                            {slots.head('default head')}
                        </div>
                        <div className="demo-use-slots-component-body">
                            {props.text}
                            {slots.default(
                                <h1>default body</h1>
                            )}
                        </div>
                        <div className="demo-use-slots-component-foot">
                            {slots.foot('default foot')}
                        </div>
                    </div>
                )
            },
        }
    },
})

export default designComponent({
    setup() {

        const state = reactive({
            text: 'hello world',
            hasHead: true,
            hasFoot: true,
        })

        return () => (
            <div>
                <input type="text" v-model={state.text}/>
                <br/>
                <input type="checkbox" checked={state.hasHead} onChange={e => state.hasHead = e.target.checked} id={"hasHead"}/>
                <label htmlFor="hasHead">hasHead</label>
                <input type="checkbox" checked={state.hasFoot} onChange={e => state.hasFoot = e.target.checked} id={"hasFoot"}/>
                <label htmlFor="hasFoot">hasFoot</label>

                <DemoUseSlotsComponent text={state.text}>
                    {{
                        head: !!state.hasHead && (() => (
                            <div>
                                自定义头部插槽内容
                            </div>
                        )),
                        foot: !!state.hasFoot && (() => (
                            <div>
                                自定义底部插槽内容
                            </div>
                        )),
                        default: () => (
                            <button disabled>默认插槽内容</button>
                        )
                    }}
                </DemoUseSlotsComponent>
            </div>
        )
    },
})