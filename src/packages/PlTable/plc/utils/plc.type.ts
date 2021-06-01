import {SimpleObject} from "../../../../shims";
import {ExtractPropTypes} from "plain-design-composition";
import {TableNode} from "../../table/use/useTableNode";
import {PlcGroupPropsOptions, PlcPropsOptions, PlcPublicAttrsType} from "./plc.utils";

export type TableRenderScope = { plc: tPlc, node: TableNode, row: SimpleObject }

type PlcPropsType = Omit<ExtractPropTypes<typeof PlcPropsOptions>, 'width' | 'order'> & { width: number, order: number | undefined }
type PlcStateType = { [k in keyof PlcPropsType]: PlcPropsType[k] | null }

type PlcGroupPropsType = Omit<ExtractPropTypes<typeof PlcGroupPropsOptions>, 'order'> & { order: number | undefined }
type PlcGroupStateType = { [k in keyof PlcGroupPropsType]: PlcGroupPropsType[k] | null }

export type tPlcGroup = PlcPublicAttrsType & {
    group: true,
    children: tPlcType[],
    props: PlcGroupPropsType,
    state: PlcGroupStateType,
    refer: () => tPlcGroup,
    setDurWidth: (width: number) => void,
}

export type tPlc = PlcPublicAttrsType & {
    group: false,
    props: PlcPropsType,
    state: PlcStateType,
    refer: () => tPlc,
    setDurWidth: (width: number) => void,
}

export type tPlcType = tPlcGroup | tPlc