import {reactive} from "vue";
import {designComponent, useModel} from "../../composition";
import React from "react";

const Input = designComponent({
    props: {
        modelValue: {},
    },
    emits: {
        onUpdateModelValue: (val?: any) => true,
    },
    setup({props, event: {emit}}) {
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        return () => (
            <input type="text" v-model={model.value}/>
        )
    },
})

export const DemoUseModel = designComponent({
    setup() {
        const state = reactive({
            text: 'hello world'
        })
        return () => {
            return (
                <div>
                    <Input v-model={state.text}/>
                    {state.text}
                </div>
            )
        }
    },
})