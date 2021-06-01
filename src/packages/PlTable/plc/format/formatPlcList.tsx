import {tPlc, tPlcType} from "../utils/plc.type";
import {copyPlcList} from "./process/copyPlcList";
import {processStateConfigAndProps} from "./process/processStateConfigAndProps";
import {TableProps} from "../../table/utils/table.utils";
import {processPlcSort} from "./process/processPlcSort";
import {processHeadPlcList} from "./process/processHeadPlcList";
import {processPlcFixed} from "./process/processPlcFixed";
import {processPlcClassAndStyle} from "./process/processPlcClassAndStyle";
import {ExtractPropTypes} from "plain-design-composition";

export function formatPlcList(
    {
        plcList,
        props,
        tableWidth,
    }: {
        plcList: tPlcType[],
        props: ExtractPropTypes<typeof TableProps>,
        tableWidth: number,
    }
) {
    /*复制一份plc数据*/
    plcList = copyPlcList(plcList)
    /*处理state、config以及props*/
    processStateConfigAndProps({plcList, config: props.config})
    /*对plc进行排序*/
    const {flatPlcList, targetTableWidth, plcKeyString} = processPlcSort({plcList, tableWidth})
    /*计算表头渲染需要的数据*/
    const {headPlcListArray, maxLevel} = processHeadPlcList({plcList})
    /*计算固定列所需要的left，right值*/
    processPlcFixed(flatPlcList)
    /*计算plc的class以及style*/
    processPlcClassAndStyle({headPlcListArray})

    return {
        plcList,                                                // 列数组数据，树形结构的数据
        flatPlcList,                                            // 展开之后最底层的列数组
        targetTableWidth,                                       // 表格设置的样式宽度
        tableWidth,                                             // 表格容器宽度
        headPlcListArray,                                       // 表头渲染的二维数组
        plcKeyString,                                           // 当列排序或者其他属性变化之后，需要刷新body，否则会出现部分节点没有更新的问题
        maxLevel,                                               // 表头层级
    }
}