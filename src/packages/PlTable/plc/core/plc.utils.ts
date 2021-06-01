import {ExtractPropTypes, MultipleClass, StyleProperties} from "plain-design-composition";
import {PlcStandardGroupOptions, PlcStandardPropOptions} from "./plc.props";

export enum ePlcAlign {
    left = 'left',
    center = 'center',
    right = 'right',
}

export enum ePlcFixedType {
    left = 'left',
    center = 'center',
    right = 'right',
}

export type PlcPublicAttrsType = {
    level: number,                      // 分组表头层级
    rowspan: number,                    // 表头td的rowspan
    colspan: number,                    // 表头td的colspan
    isLastFixedLeft: boolean,           // 是否为最后一个左固定列
    isFirstFixedRight: boolean,         // 是否为第一个右固定列
    fixedPosition: {                    // 固定列的sticky位置
        left: number,
        right: number,
    },
    // 列style公共内联样式
    styles: {
        head: StyleProperties,
        body: StyleProperties,
    },
    // 列公共class样式
    classes: {
        head: MultipleClass,
        body: MultipleClass,
    },
}

/**
 * Plc以及PlcGroup公共的一些属性
 * @author  韦胜健
 * @date    2020/12/18 14:41
 */
export const PlcPublicAttrs: PlcPublicAttrsType = {
    level: 0,
    rowspan: 1,
    colspan: 1,
    isLastFixedLeft: false,
    isFirstFixedRight: false,
    fixedPosition: {
        left: 0,
        right: 0,
    },
    styles: {
        head: {},
        body: {},
    },
    classes: {
        head: [],
        body: [],
    },
}

type PlcPropsType = Omit<ExtractPropTypes<typeof PlcStandardPropOptions>, 'width' | 'order'> & { width: number, order: number | undefined }
type PlcGroupPropsType = Omit<ExtractPropTypes<typeof PlcStandardGroupOptions>, 'order'> & { order: number | undefined }

export type tPlcGroup = PlcPublicAttrsType & {
    props: PlcGroupPropsType,
    group: true,
    children: tPlcType[],
    refer: () => tPlcGroup,
}

export type tPlc = PlcPublicAttrsType & {
    props: PlcPropsType,
    group: false,
    refer: () => tPlc,
}

export type tPlcType = tPlcGroup | tPlc