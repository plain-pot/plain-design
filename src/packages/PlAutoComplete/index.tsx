import {designComponent, useModel} from "plain-design-composition";
import React from "react";
import PlInput from "../PlInput";

export const PlAutoComplete = designComponent({
    props: {
        modelValue: {type: [String, Number]},
    },
    emits: {
        onUpdateModelValue: (val?: string | number) => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        return {
            render: () => (
                <PlInput
                    v-model={model.value}
                />
            )
        }
    },
})

export default PlAutoComplete