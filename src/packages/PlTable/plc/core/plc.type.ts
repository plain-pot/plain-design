import {SimpleObject} from "../../../../shims";
import {ExtractPropTypes} from "plain-design-composition";
import {TableNode} from "../../core/useTableNode";
import {PlcGroupProps, PlcProps, PlcPublicAttrsType} from "./plc.utils";

export type TableRenderScope = { plc: Plc, node: TableNode, row: SimpleObject }

type PlcPropsType = Omit<ExtractPropTypes<typeof PlcProps>, 'width' | 'order'> & { width: number, order: number | undefined }
type PlcStateType = { [k in keyof PlcPropsType]: PlcPropsType[k] | null }

type PlcGroupPropsType = Omit<ExtractPropTypes<typeof PlcGroupProps>, 'order'> & { order: number | undefined }
type PlcGroupStateType = { [k in keyof PlcGroupPropsType]: PlcGroupPropsType[k] | null }

export type PlcGroup = PlcPublicAttrsType & {
    group: true,
    children: TablePlc[],
    props: PlcGroupPropsType,
    state: PlcGroupStateType,
    refer: () => PlcGroup,
    setDurWidth: (width: number) => void,
}

export type Plc = PlcPublicAttrsType & {
    group: false,
    props: PlcPropsType,
    state: PlcStateType,
    refer: () => Plc,
    setDurWidth: (width: number) => void,
}

export type TablePlc = PlcGroup | Plc