import {computed, ExtractPropTypes, reactive, useNumber, useRefs} from "plain-design-composition";
import {PlcPropsOptions, PlcPublicAttrs} from "../utils/plc.utils";
import {tPlcScopeSlots} from "../utils/plc.scope-slots";
import {PlcCollector} from "./PlcGroup";
import {tPlc, tPlcEvent} from "../utils/plc.type";
import React from "react";
import {getPropsState, usePropsState} from "../utils/usePropsState";
import PlTable from "../../index";

export function useBasePlc({props, scopeSlots, event}: {
    props: ExtractPropTypes<typeof PlcPropsOptions>,
    scopeSlots: tPlcScopeSlots,
    event: tPlcEvent,
}) {
    const table = PlTable.use.inject()
    const {refs, onRef} = useRefs({el: HTMLElement})

    /*collector收集列信息*/
    PlcCollector.child({sort: () => refs.el!})
    /*格式化props*/
    const {numberState} = useNumber(props, ['order', 'width'])

    const {propsState, state} = usePropsState(computed(() => ({
        ...props,
        ...numberState,
    }) as Omit<typeof props, 'order' | 'width'> & typeof numberState))

    const plc: tPlc = reactive({
        /*PlcPublicAttrs 在 copyPlc中会深度复制一遍，这里适配类型即可*/
        ...PlcPublicAttrs,
        group: false,
        props: propsState,
        scopeSlots,
        event,
        refer: () => plc,
        refs,
        setDurWidth: (durWidth: number) => plc.setPropsState({width: Number((propsState.width)) + durWidth}),
        setPropsState: (data: any) => {
            Object.entries(data).forEach(([key, val]) => {(propsState as any)[key] = val})
            table.hooks.onConfigPlc.exec({plcList: table.plcData.value!.sourceList, stateData: getPropsState(table.plcData.value!.sourceList),})
        },
        getState: () => state as any,
    })

    return {
        refer: plc,
        render: () => (<i ref={onRef.el} {...{title: props.title, field: props.field}}/>)
    }
}