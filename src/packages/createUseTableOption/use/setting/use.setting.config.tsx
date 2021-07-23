import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {PlcPropsType, tPlc} from "../../../PlTable/plc/utils/plc.type";
import {deepcopy} from "plain-utils/object/deepcopy";
import PlTable from "../../../PlTable";
import {Plc} from "../../../Plc";
import {PlcIndex} from "../../../PlcIndex";
import {PlcDraggier} from "../../../PlcDraggier";
import {reactive} from "plain-design-composition";

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
        },
        render: () => (
            <div>
                <PlTable data={state.data} showRows={Math.max(5, state.data.length)}>
                    <PlcIndex/>
                    <PlcDraggier/>
                    <Plc title="标题" field="title"/>
                    <Plc title="对齐方式" field="align"/>
                    <Plc title="固定" field="fixed"/>
                    <Plc title="宽度" field="width"/>
                    <Plc title="隐藏" field="hidden"/>
                </PlTable>
            </div>
        )
    })
}
