import {computed, ExtractPropTypes, onBeforeUnmount, reactive, useRefs, watch} from "plain-design-composition";
import {TableProps} from "../../table/utils/table.utils";
import {formatPlcList} from "./formatPlcList";
import PlcGroup from "../core/PlcGroup";
import React, {ReactNode} from "react";
import {tTableHooks} from "../../table/use/useTableHooks";
import {tPlcType} from "../utils/plc.type";

/**
 * 负责监听根group，收集plcTypeArr
 * @author  韦胜健
 * @date    2021/6/1 16:10
 */
export function usePlcList({props, slots, hooks}: {
    props: ExtractPropTypes<typeof TableProps>,
    slots: { default: () => ReactNode },
    hooks: tTableHooks,
}) {

    const {refs, onRef} = useRefs({group: PlcGroup})
    const renderCollector = () => <PlcGroup ref={onRef.group}>{slots.default()}</PlcGroup>

    /*---------------------------------------state-------------------------------------------*/

    const state = reactive({
        tableWidth: null as null | number,
        getTableEl: null as null | (() => HTMLDivElement),
        getPlcTypeArr: null as null | (() => tPlcType[]),
    });

    hooks.onPlcTypes.use(list => {state.getPlcTypeArr = () => list});

    (() => {
        /*table 挂载的时候保存table的宽度*/
        const ejectTableMounted = hooks.onTableMounted.use(el => {
            state.tableWidth = el.offsetWidth
            state.getTableEl = () => el
        })

        const onWindowResize = () => {state.tableWidth = state.getTableEl!().offsetWidth}
        window.addEventListener('resize', onWindowResize)

        const unWatch = watch(() => !refs.group ? null : refs.group.children, list => {hooks.onPlcTypes.exec(list || [])})

        onBeforeUnmount(() => {
            ejectTableMounted()
            window.removeEventListener('resize', onWindowResize)
            unWatch()
        })
    })();

    /*---------------------------------------computed-------------------------------------------*/

    const plcData = computed(() => {
        if (!state.tableWidth || !state.getPlcTypeArr) {return null}
        return formatPlcList({
            props,
            plcList: state.getPlcTypeArr(),
            tableWidth: state.tableWidth,
        })
    })

    return {
        plcData,
        renderCollector,
    }
}