import {computed, ExtractPropTypes, reactive, useNumber, useRefs} from "plain-design-composition";
import {PlcPropsOptions, PlcPublicAttrs} from "../utils/plc.utils";
import {tPlcScopeSlots} from "../utils/plc.scope-slots";
import {PlcCollector} from "./PlcGroup";
import {tPlc, tPlcEvent} from "../utils/plc.type";
import React from "react";

export function useBasePlc({props, scopeSlots, event}: {
    props: ExtractPropTypes<typeof PlcPropsOptions>,
    scopeSlots: tPlcScopeSlots,
    event: tPlcEvent,
}) {
    const {refs, onRef} = useRefs({el: HTMLElement})

    /*collector收集列信息*/
    PlcCollector.child({sort: () => refs.el!})
    /*格式化props*/
    const {numberState} = useNumber(props, ['order', 'width'])
    /*目标props*/
    const formatProps = computed(() => ({
        ...props,
        ...numberState,
    }) as Omit<typeof props, 'order' | 'width'> & typeof numberState)
    /*props的一个副本，不过如果有值的情况下，优先级比props中的值高（比config值也高）*/
    const propsState = reactive(Object.keys(PlcPropsOptions).reduce((ret: any, key: string) => {
        ret[key] = null
        return ret
    }, {}) as { [k in keyof typeof formatProps.value]: typeof formatProps.value[k] | null })

    const plc: tPlc = reactive({
        /*PlcPublicAttrs 在 copyPlc中会深度复制一遍，这里适配类型即可*/
        ...PlcPublicAttrs,
        group: false,
        props: formatProps,
        scopeSlots,
        state: propsState,
        event,
        refer: () => plc,
        refs,
        setDurWidth: (durWidth: number) => propsState.width = Number((formatProps.value.width)) + durWidth,
    })

    return {
        refer: plc,
        render: () => (<i ref={onRef.el} {...{title: props.title, field: props.field}}/>)
    }
}