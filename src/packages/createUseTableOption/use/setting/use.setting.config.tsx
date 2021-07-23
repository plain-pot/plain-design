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

export function useTableOptionSettingConfig(
    {
        useTableOptionSettingInner,
        getSourceFlatPlcList,
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        getSourceFlatPlcList: () => tPlc[],
    }) {

    const state = reactive({
        data: [] as PlcPropsType[]
    })

    const utils = {
        resetData: () => {
            state.data = getSourceFlatPlcList().map((i, index): PlcPropsType => ({
                ...i.getState(),
                title: i.props.title,
                order: index,
            }))
            console.log(deepcopy(state.data))
        }
    }

    const handler = {
        apply: () => {

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
                    <PlButton label="应用"/>
                    <PlButton label="重置" mode="stroke" status="error" onClick={handler.reset}/>
                </div>
                <PlTable data={state.data} showRows={Math.max(5, state.data.length)} defaultEditingWhenAddRow>
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
