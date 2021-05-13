import {computed, ExtractPropTypes, onMounted, reactive, useRefs, watch} from "plain-design-composition";
import {TableDefaultRowHeight, TableProps} from "../../core/table.utils";
import {PlcCollector} from "../core/PlcCollector";
import {formatPlcList} from "./formatPlcList";
import {removeUnit} from "plain-utils/string/removeUnit";
import {StyleSize, useStyle} from "../../../../use/useStyle";

export function usePlcList({props, styleComputed}: {
    props: ExtractPropTypes<typeof TableProps>,
    styleComputed: ReturnType<typeof useStyle>["styleComputed"],
}) {

    const {refs, onRef} = useRefs({collector: PlcCollector, el: HTMLDivElement,})

    /*---------------------------------------state-------------------------------------------*/

    const state = reactive({
        /*表格宽度*/
        tableWidth: null as null | number,
    })

    const {numberState} = (() => {
        const watchValue = computed(() => {
            const {bodyRowHeight: propsBodyRowHeight, headRowHeight: propsHeadRowHeight,} = props
            let {size} = styleComputed.value
            if (!size) {size = StyleSize.normal}
            const bodyRowHeight = Number(propsBodyRowHeight == null ? removeUnit(TableDefaultRowHeight.body[size]) : propsBodyRowHeight)
            const headRowHeight = Number(propsHeadRowHeight == null ? removeUnit(TableDefaultRowHeight.head[size]) : propsHeadRowHeight)
            return {bodyRowHeight, headRowHeight}
        })
        const numberState = reactive({...watchValue.value,})
        watch(watchValue, () => Object.assign(numberState, watchValue.value))
        return {numberState}
    })();

    /*---------------------------------------computed-------------------------------------------*/

    const plcData = computed(() => {
        if (!state.tableWidth || !refs.collector) {
            return null
        }
        const {children} = refs.collector
        return formatPlcList({
            plcList: children,
            props,
            tableWidth: state.tableWidth,
        })
    })

    onMounted(() => {
        state.tableWidth = refs.el!.offsetWidth
    })

    return {
        refs, onRef, numberState, plcData,
    }
}