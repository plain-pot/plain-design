import {computed, designComponent, ExtractPropTypes, useNumber, useRefs} from "plain-design-composition";
import {PlcProps, PlcPublicAttrs} from "./plc.utils";
import {Plc} from "./plc.type";
import {reactive} from "@vue/reactivity";
import {usePlcCollector} from "./PlcCollector";
import React from "react";

export function usePlc(props: ExtractPropTypes<typeof PlcProps>,) {
    const {refs, onRef} = useRefs({el: HTMLElement})

    /*collector收集列信息*/
    usePlcCollector.useChild()
    /*格式化props*/
    const {numberState} = useNumber(props, ['order', 'width'])
    /*目标props*/
    const formatProps = computed(() => ({
        ...props,
        ...numberState,
    }) as Omit<typeof props, 'order' | 'width'> & typeof numberState)
    /*props的一个副本，不过如果有值的情况下，优先级比props中的值高（比config值也高）*/
    const propsState = reactive(Object.keys(PlcProps).reduce((ret: any, key: string) => {
        ret[key] = null
        return ret
    }, {}) as { [k in keyof typeof formatProps.value]: typeof formatProps.value[k] | null })

    const plc: Plc = reactive({
        /*PlcPublicAttrs 在 copyPlc中会深度复制一遍，这里适配类型即可*/
        ...PlcPublicAttrs,
        group: false,
        props: formatProps,
        state: propsState,
        refer: () => plc,
        refs,
        setDurWidth: (durWidth: number) => propsState.width = Number((formatProps.value.width)) + durWidth,
    })

    return {
        refer: plc,
        render: () => (<i ref={onRef.el} {...{title: props.title, field: props.field}}/>)
    }
}

export default designComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    setup({props}) {
        return usePlc(props)
    },
})