import {tPlcType} from "../../../../plc/core/plc.utils";

export function getPltCellClass(plc: tPlcType) {
    return {
        // 'pl-cell-group': plc.group,
        [`plt-cell-align-${plc.state.align}`]: !!plc.state.align,
    }
}