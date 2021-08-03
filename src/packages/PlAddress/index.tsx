import {designComponent, reactive, useModel} from "plain-design-composition";
import React from "react";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps} from "../../use/useStyle";
import PlInput from "../PlInput";

export const PlAddress = designComponent({
    props: {
        ...EditProps,
        ...StyleProps,

        name: {type: [String, Number]},                 // 绑定的显示文本
        value: {type: [String, Number]},                // 绑定值，如果bindId为true，那么就是绑定id；
        parentValue: {type: [String, Number]},          // 父绑定值，如果bindId为true，那么就是绑定id；

        country: {type: Boolean, default: false},       // 是否为国家选择器（此时可以不用给parentValue）
        region: {type: Boolean, default: false},        // 是否为选择省份
        city: {type: Boolean, default: false},          // 是否为选择城市
        district: {type: Boolean, default: false},      // 是否为选择区县
    },
    emits: {
        onUpdateName: (val?: string | number) => true,
        onUpdateValue: (val?: string | number) => true,
        onChange: (data: { name?: string | number, value?: string | number }) => true,
    },
    setup({props, event: {emit}}) {

        const {editComputed, editState} = useEdit()
        /*显示值双向绑定值*/
        const nameModel = useModel(() => props.name, emit.onUpdateName)
        /*值双向绑定值*/
        const valueModel = useModel(() => props.value, emit.onUpdateValue)

        const freezeState = {
            parentValue: undefined as undefined | string | number,
        }

        const state = reactive({})

        return () => (
            <PlInput/>
        )
    },
})