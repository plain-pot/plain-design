import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {PlcPropsType, tPlc} from "../../../PlTable/plc/utils/plc.type";
import PlTable from "../../../PlTable";
import {Plc} from "../../../Plc";
import {PlcIndex} from "../../../PlcIndex";
import {PlcDraggier} from "../../../PlcDraggier";
import {reactive} from "plain-design-composition";
import {PlcSelect} from "../../../PlcSelect";
import PlSelectOption from "../../../PlSelectOption";
import {PlcCheckbox} from "../../../PlcCheckbox";
import {PlcNumber} from "../../../PlcNumber";
import PlButton from "../../../PlButton";
import './use.setting.config.scss'
import {deepcopy} from "plain-utils/object/deepcopy";

interface iPlcConfigData {
    title?: string,
    order: number,
    align: string,
    width: number,
    fixed: string,
    hide?: boolean,
}

export function useTableOptionSettingConfig(
    {
        useTableOptionSettingInner,
        getSourceFlatPlcList,
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        getSourceFlatPlcList: () => tPlc[],
    }) {

    const state = reactive({
        data: [] as iPlcConfigData[]
    })

    const utils = {
        resetData: () => {
            state.data = getSourceFlatPlcList().map((i, index): iPlcConfigData => ({
                title: i.props.title,
                order: index,
                align: i.props.align || 'left',
                width: i.props.width,
                fixed: i.props.fixed,
                hide: i.props.hide,
            }))
            console.log(deepcopy(state.data))
        }
    }

    const handler = {
        apply: () => {
            const hasOrderChange = state.data.some((i, idx) => i.order !== idx)
            const sourceFlatList = getSourceFlatPlcList()
            state.data.forEach((item, index) => {
                const plcState = sourceFlatList[index].getState()
                if (hasOrderChange) {plcState.order = index}
                Object.entries(item).forEach(([key, value]) => {
                    if (value != (plcState as any)[key]) {
                        switch (key) {
                            case 'order':
                                return;
                            case 'align':
                                if (plcState.align === undefined) {
                                    if (value !== 'left') {
                                        plcState.align = value as any
                                    }
                                } else {
                                    if (plcState.align != value) {
                                        plcState.align = value as any
                                    }
                                }
                            default:
                                if ((plcState as any)[key] != value) {
                                    (plcState as any)[key] = value
                                }
                        }
                    }
                })
            })
        },
        reset: () => {
            getSourceFlatPlcList().forEach(plc => {
                const state = plc.getState()
                Object.keys(state).forEach(key => {
                    (state as any)[key] = undefined
                })
            })
            utils.resetData()
        },
    }

    useTableOptionSettingInner({
        key: eTableOptionSettingView.config,
        title: '个性设置',
        seq: 3,
        beforeOpen: () => {
            utils.resetData()
        },
        render: () => (
            <div className="pl-table-pro-setting-config">
                <div className="pl-table-pro-setting-config-button">
                    <PlButton label="应用" onClick={handler.apply}/>
                    <PlButton label="重置" mode="stroke" status="error" onClick={handler.reset}/>
                </div>
                <PlTable data={state.data} showRows={Math.max(5, state.data.length)} defaultEditingWhenAddRow editSourceRow>
                    <PlcIndex/>
                    <PlcDraggier/>
                    <Plc title="标题" field="title"/>
                    <PlcSelect title="对齐方式" field="align">
                        <PlSelectOption label="左对齐" val="left"/>
                        <PlSelectOption label="居中对齐" val="center"/>
                        <PlSelectOption label="右对齐" val="right"/>
                    </PlcSelect>
                    <PlcNumber title="宽度" field="width"/>
                    <PlcCheckbox title="固定" width={50} align="center" field="fixed" trueValue="left" falseValue={undefined}/>
                    <PlcCheckbox title="隐藏" width={50} align="center" field="hidden" trueValue={true} falseValue={undefined}/>
                    <Plc title={' '} fit/>
                </PlTable>
            </div>
        )
    })
}
