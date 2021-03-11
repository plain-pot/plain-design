import React, {useRef, useState} from "react";
import {designComponent, useModel} from "../composition";

export const TestModel = designComponent({
    props: {
        value: {type: [String, Number]},
    },
    emits: {
        onUpdateModelValue: (val?: string | number) => true,
    },
    setup({props, event}) {
        const model = useModel(() => props.value, event.emit.onUpdateModelValue)
        return () => (
            <div>
                <h1>测试model 绑定</h1>
                <input type="text" v-model={model.value}/>
            </div>
        )
    },
})

export const TestModelMore = designComponent({
    props: {
        range: {type: Boolean},
        value: {type: [String, Number]},
        start: {type: [String, Number]},
        end: {type: [String, Number]},
    },
    emits: {
        onUpdateModelValue: (val?: string | number) => true,
        onUpdateStart: (val?: string | number) => true,
        onUpdateEnd: (val?: string | number) => true,
    },
    setup({props, event}) {
        const modelValue = useModel(() => props.value, event.emit.onUpdateModelValue)
        const modelStart = useModel(() => props.start, event.emit.onUpdateStart)
        const modelEnd = useModel(() => props.end, event.emit.onUpdateEnd)

        return () => (
            <div>
                {props.range ? <>
                    <input type="text" v-model={modelStart.value}/>
                    <input type="text" v-model={modelEnd.value}/>
                </> : <input type="text" v-model={modelValue.value}/>}
            </div>
        )
    },
})

export const TestInput: React.FC<{
    value?: string | number,
    onUpdateModelValue?: (val?: string | number) => void,
}> = (props) => {

    const prevValueRef = useRef(props.value)
    let [value, setValue] = useState(props.value)

    if (prevValueRef.current !== props.value) {value = props.value}
    prevValueRef.current = props.value

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setValue(val)
        !!props.onUpdateModelValue && props.onUpdateModelValue(val)
        console.log('input change', e.target.value)
    }

    return (
        <div>
            #####
            <div><input type="text" value={value || ''} onInput={onChange}/></div>
        </div>
    )
}