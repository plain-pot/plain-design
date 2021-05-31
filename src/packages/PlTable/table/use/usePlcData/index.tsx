import {reactive} from "plain-design-composition";
import {tTableHooks} from "../useTableHooks";
import {tPlcType} from "../../../plc/core/plc.utils";

export function usePlcData({hooks}: { hooks: tTableHooks }) {

    const state = reactive({
        getPlcTypeArr: null as null | (() => tPlcType[]),
        tableWidth: null as null | number,
    })

    hooks.onCollectPlc.use((plcTypeArr) => {state.getPlcTypeArr = () => plcTypeArr})

    hooks.onTableMounted.use(el => {state.tableWidth = el.offsetWidth})



    return {}
}