import {computed, reactive} from "plain-design-composition";
import {tTableHooks} from "../useTableHooks";
import {tPlcType} from "../../../plc/core/plc.utils";
import {formatPlcList} from "./formatPlcList";

export function usePlcData({hooks,}: { hooks: tTableHooks }) {

    const state = reactive({
        getPlcTypeArr: null as null | (() => tPlcType[]),
        tableWidth: null as null | number,
    })

    /*收集列信息*/
    hooks.onCollectPlc.use((plcTypeArr) => {state.getPlcTypeArr = () => plcTypeArr})

    /*列宽需要知道表格宽度*/
    hooks.onTableMounted.use(el => {state.tableWidth = el.offsetWidth})

    /*格式化列信息*/
    const plcData = computed(() => {
        if (!state.tableWidth || !state.getPlcTypeArr) {
            return null
        }
        return formatPlcList({
            plcList: state.getPlcTypeArr(),
            tableWidth: state.tableWidth,
        })
    })

    return {
        plcData,
    }
}