import {computed, ExtractPropTypes, onMounted, reactive, useRefs, watch} from "plain-design-composition";
import {TableDefaultRowHeight, TableProps} from "../../table/utils/table.utils";
import {formatPlcList} from "./formatPlcList";
import {removeUnit} from "plain-utils/string/removeUnit";
import {StyleSize, useStyle} from "../../../../use/useStyle";
import PlcGroup from "../core/PlcGroup";

export function usePlcList({props, styleComputed}: {
    props: ExtractPropTypes<typeof TableProps>,
    styleComputed: ReturnType<typeof useStyle>["styleComputed"],
}) {

    const {refs, onRef} = useRefs({group: PlcGroup, el: HTMLDivElement,})

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
        if (!state.tableWidth || !refs.group) {
            return null
        }
        const {children} = refs.group
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