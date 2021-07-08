import {designComponent, PropType, reactive, useModel} from "plain-design-composition";
import React from "react";
import PlInput from "../../PlInput";

export const FilterTextContains = designComponent({
    props: {
        modelValue: {type: Array as PropType<any[]>},
    },
    emits: {
        onUpdateModelValue: (val?: any[]) => true,
        onEnter: () => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const state = reactive({
            text: (model.value || []).join(',')
        })

        const handler = {
            onChange: () => {
                if (state.text === (model.value || []).join(',')) {
                    return
                } else {
                    model.value = state.text.split(/[,，]/g)
                }
            }
        }

        return () => <PlInput v-model={state.text} onChange={handler.onChange} onEnter={emit.onEnter}/>
    },
})
