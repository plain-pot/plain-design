import {tTableOptionHooks} from "../use.hooks";
import {reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";

export function useColumnFilter({hooks}: { hooks: tTableOptionHooks }) {
    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
    })

    hooks.onCollectPlcData.use(val => { state.getSourceFlatPlcList = (() => val.sourceFlatPlcList)})

    hooks.onClickHead.use(({plc, e}) => {
        if (plc.group) {
            /*分组表头不做处理, 仅处理列表头*/
            return
        }
        state.getSourceFlatPlcList!().forEach(i => console.log({...i.props}))
    })

    return {
        state,
    }
}