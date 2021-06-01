/**
 * 在遍历plc的时候，操作类型，remove意思是遍历完这一次之删除这个plc或者plc组
 * @author  韦胜健
 * @date    2020/8/14 17:26
 */

import {tPlc, tPlcGroup, tPlcType} from "../../../../plc/core/plc.utils";

export enum IteratePlcHandleType {
    remove = 'remove',                      // 移除当前节点
    nothing = 'nothing'                     // 什么事也不做
}

export function iteratePlcList(
    {
        plcList,
        onPlc,
        onGroup,
    }: {
        plcList: tPlcType[],
        onPlc: (plc: tPlc) => IteratePlcHandleType,
        onGroup: (group: tPlcGroup) => IteratePlcHandleType,
    }
) {

    for (let i = 0; i < plcList.length; i++) {
        const tPlc = plcList[i];
        if (!tPlc.group) {
            const handleType = onPlc(tPlc)
            if (handleType === IteratePlcHandleType.remove) {
                plcList.splice(i, 1)
                i--
            }
        } else {
            const handleType = onGroup(tPlc)
            if (handleType === IteratePlcHandleType.remove) {
                plcList.splice(i, 1)
                i--
            } else {
                iteratePlcList({plcList: tPlc.children, onPlc, onGroup,})
                // 当这个分组没有列的时候（可能都隐藏了），自动删除这个分组
                if (tPlc.children.length === 0) {
                    plcList.splice(i, 1)
                    i--
                }
            }
        }
    }

}