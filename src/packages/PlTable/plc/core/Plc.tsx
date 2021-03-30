import {computed, designComponent, ExtractPropTypes, useNumber} from "plain-design-composition";
import {PlcProps, PlcPublicAttrs} from "./plc.utils";
import {Plc, TablePlc} from "./plc.type";
import {TableNode} from "../../core/useTableNode";
import {reactive} from "@vue/reactivity";
import {usePlcCollector} from "./PlcCollector";
import React, {ReactNode} from "react";
import {SimpleFunction} from "plain-design-composition/src/composition/event";

const PlcScopeSlotsOption = {
    head: (scope: { plc: TablePlc }) => {},
    default: (scope: { plc: TablePlc, node: TableNode }) => {},
    edit: (scope: { plc: TablePlc, node: TableNode }) => {},
    summary: (scope: { plc: TablePlc, node: TableNode }) => {},
}

type ScopeSlotOptionType<Option extends { [k: string]: SimpleFunction }> = { [k in keyof Option]: ((scope: Parameters<Option[k]>[0], defaultNode?: ReactNode) => ReactNode) & { isExist: () => boolean } }
type PlcScopeSlotType = ScopeSlotOptionType<typeof PlcScopeSlotsOption>

export function usePlc({props, scopeSlots}: {
    props: ExtractPropTypes<typeof PlcProps>,
    scopeSlots: PlcScopeSlotType,
}) {
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
        setDurWidth: (durWidth: number) => propsState.width = Number((formatProps.value.width)) + durWidth,
        scopeSlots,
    })

    return {
        refer: plc,
        render: () => (<i {...{title: props.title, field: props.field}}/>)
    }
}

export default designComponent({
    name: 'plc',
    props: {
        ...PlcProps,
    },
    scopeSlots: PlcScopeSlotsOption,
    setup({props, scopeSlots}) {
        return usePlc({props, scopeSlots})
    },
})