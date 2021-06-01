import {deepcopy} from "plain-utils/object/deepcopy";
import {PlcPublicAttrs, tPlcType} from "../../../../plc/core/plc.utils";

/**
 * 浅复制一份plc数据，复制plc最外层对象以及plc.props数据，props数据是需要动态计算修改的。
 * state不能复制，因为需要其响应式属性。
 * @author  韦胜健
 * @date    2020/12/18 10:06
 */
export function copyPlcList(plcList: tPlcType[]) {
    return plcList.map(plc => {
        const refer = plc.refer()
        const newPlc: tPlcType = {
            ...refer,
            ...deepcopy(PlcPublicAttrs),
        }
        newPlc.state = {...newPlc.state}
        if (newPlc.group) {
            newPlc.items = {value: copyPlcList(newPlc.items.value)}
        }
        return newPlc
    })
}