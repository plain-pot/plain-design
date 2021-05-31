import {ExtractPropTypes} from "plain-design-composition";
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

export interface iPlcGroup {
    state: ExtractPropTypes<typeof PlcStandardGroupOptions>,
    group: true,
    items: { value: iPlc[] }
}

export interface iPlc {
    state: ExtractPropTypes<typeof PlcStandardPropOptions>,
}