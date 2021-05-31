/*---------------------------------------group-------------------------------------------*/

import {PropType} from "plain-design-composition";
import {ePlcAlign, ePlcFixedType} from "./plc.utils";

export const PlcStandardGroupOptions = {
    title: {type: String},                                                  // 列标题
    align: {type: String as PropType<string | ePlcAlign | typeof ePlcAlign>},// 非编辑状态下文本对其方式
    noPadding: {type: Boolean},                                             // 是否不兼容表格的虚拟滚动功能
    colDraggable: {type: Boolean, default: null},                           // 列是否可以拖拽排序

    hide: {type: Boolean},                                                  // 是否隐藏
    order: {type: [String, Number]},                                        // 列排序
    fixed: {type: String as PropType<string | ePlcFixedType | typeof ePlcFixedType>, default: ePlcFixedType.center},// 冻结列位置：left、right、undefined
    autoFixedLeft: {type: Boolean},                                         // 当出现左固定列的时候，是否自动设置为左固定列
    autoFixedRight: {type: Boolean},                                        // 当出现右固定列的时候，是否自动设置为右固定列

    headCls: {},                                                            // 给表头添加的class
    bodyCls: {},                                                            // 给表体添加的class
}

/*---------------------------------------plc-------------------------------------------*/

export const PlcStandardPropOptions = {
    ...PlcStandardGroupOptions,
    field: {type: String},                                                  // 列绑定字段
    width: {type: [String, Number], default: 120},                          // 列宽度
    fit: {type: Boolean},                                                   // 列宽自适应(只有一个列能够自适应)

    addEditPadding: {type: Boolean},                                        // 处于编辑状态的时候，是否添加内编辑，只有当行状态为编辑状态，并且列有edit渲染函数或者作用域插槽时，才符合“处于编辑状态”的条件
}