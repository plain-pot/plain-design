import {designComponent, useModel} from "plain-design-composition";
import React from "react";
import {reactive} from "@vue/reactivity";

const DemoUseModelComponent = designComponent({
    props: {
        modelValue: {},
        start: {},
        end: {},
        range: {type: Boolean}
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
        onUpdateStart: (val: any) => true,
        onUpdateEnd: (val: any) => true,
    },
    setup({props, event: {emit}}) {

        const modelValue = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const modelStart = useModel(() => props.start, emit.onUpdateStart)
        const modelEnd = useModel(() => props.end, emit.onUpdateEnd)

        return {
            render: () => {
                return (
                    <div className="demo-use-model-component">
                        {!props.range ? (
                            <div>
                                <input type="text" v-model={modelValue.value}/>
                            </div>
                        ) : (
                            <div>
                                <input type="text" v-model={modelStart.value}/>
                                ~
                                <input type="text" v-model={modelEnd.value}/>
                            </div>
                        )}
                    </div>
                )
            }
        }
    },
})

export default designComponent({
    setup() {

        const state = reactive({
            text: 'hello world',
            startValue: 'hello',
            endValue: 'world'
        })

        return () => (
            <div>
                <h4>单项绑定</h4>
                <DemoUseModelComponent v-model={state.text}/>
                <DemoUseModelComponent v-model={state.text}/>
                <h4>多值绑定</h4>
                <DemoUseModelComponent range v-model-start={state.startValue} v-model-end={state.endValue}/>
                <DemoUseModelComponent range v-model-start={state.startValue} v-model-end={state.endValue}/>
            </div>
        )
    },
})