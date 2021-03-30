import {TableProps} from "../../core/table.utils";
import PlcCollector from "../core/plc-collector";
import {formatPlcList} from "./formatPlcList";
import {computed, ExtractPropTypes, onMounted, reactive, useNumber, useRefs} from "plain-design-composition";

export function usePlcList(
    {
        props,
    }: {
        props: ExtractPropTypes<typeof TableProps>
    }
) {

    const {refs} = useRefs({
        collector: PlcCollector,
        el: HTMLDivElement,
    })

    /*---------------------------------------state-------------------------------------------*/

    const state = reactive({
        /*表格宽度*/
        tableWidth: null as null | number,
    })
    const {numberState} = useNumber(props, ['bodyRowHeight', 'headRowHeight'])

    /*---------------------------------------computed-------------------------------------------*/

    const plcData = computed(() => {
        if (!state.tableWidth) {
            return null
        }
        const {children} = refs.collector!
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
        numberState,
        plcData,
    }
}