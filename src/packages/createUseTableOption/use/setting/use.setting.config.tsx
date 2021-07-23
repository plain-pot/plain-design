import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {PlcPropsType, tPlc} from "../../../PlTable/plc/utils/plc.type";
import {deepcopy} from "plain-utils/object/deepcopy";
import PlTable from "../../../PlTable";
import {Plc} from "../../../Plc";
import {PlcIndex} from "../../../PlcIndex";
import {PlcDraggier} from "../../../PlcDraggier";
import {reactive} from "plain-design-composition";
import {PlcSelect} from "../../../PlcSelect";
import PlSelectOption from "../../../PlSelectOption";
import {PlcCheckbox} from "../../../PlcCheckbox";
import {PlcNumber} from "../../../PlcNumber";

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

    useTableOptionSettingInner({
        key: eTableOptionSettingView.config,
        title: '个性设置',
        seq: 3,
        beforeOpen: () => {
            state.data = getSourceFlatPlcList().map((i): PlcPropsType => ({
                ...i.getState(),
                title: i.props.title,
            }))
            console.log(deepcopy(state.data))
        },
        render: () => (
            <div>
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
