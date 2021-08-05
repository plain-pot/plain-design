import {designComponent, reactive, useModel, watch} from "plain-design-composition";
import React from "react";
import PlSelect from "../PlSelect";
import {iOvData} from "../useOv/useOv.utils";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps} from "../../use/useStyle";
import useOv from "../useOv";
import PlSelectOption from "../PlSelectOption";
import {deepcopy} from "plain-utils/object/deepcopy";

export const PlOv = designComponent({
    props: {
        ...EditProps,
        ...StyleProps,
        modelValue: {type: [String, Number]},
        ov: {type: String},
    },
    emits: {
        onUpdateModelValue: (val?: string | number) => true,
    },
    setup({props, event: {emit}}) {

        const {$ov} = useOv()

        const {editComputed, editState} = useEdit()

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const state = reactive({
            ovList: [] as iOvData[]
        })

        watch(() => props.ov, async type => {
            if (!type) {
                return state.ovList = []
            }
            editState.loading = true
            state.ovList = await $ov.getOvByType(type)
            editState.loading = false
        }, {immediate: true})

        return () => (
            <PlSelect
                modelValue={editComputed.value.loading ? '加载中...' : model.value}
                onUpdateModelValue={val => model.value = val as string}
            >
                {state.ovList.map((ov, index) => (
                    <PlSelectOption label={ov.name} val={ov.code} key={index}/>
                ))}
            </PlSelect>
        )
    },
})

export default PlOv
