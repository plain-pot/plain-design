import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import './use.setting.export.scss'
import {tTableOptionCheck} from "../check/use.check";
import {defer} from "../../../../utils/defer";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import PlRadioGroup from "../../../PlRadioGroup";
import {reactive} from "plain-design-composition";
import PlRadio from "../../../PlRadio";
import PlArrowStepGroup from "../../../PlArrowStepGroup";
import PlArrowStep from "../../../PlArrowStep";

interface ExportOption {
    type: string,
    title: string,
    desc: string,
    handler: () => Promise<void>,
}

export function useTableOptionSettingExport(
    {
        useTableOptionSettingInner,
        closeSetting,
        check,
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        closeSetting: () => void,
        check: tTableOptionCheck,
    }) {

    const state = reactive({
        exportType: null as null | string,
    })

    const getExportFlatList = async () => {
        const dfd = defer<tPlc[]>()


        return dfd.promise
    }

    const exportOptions: ExportOption[] = [
        {
            type: 'export-page',
            title: '导出当前页数据',
            desc: '将表格当前展示的数据导出。',
            handler: async () => {

            }
        },
        {
            type: 'export-all',
            title: '导出当前所有数据',
            desc: '根据当前的筛选排序条件导出所有数据(数据量比较大的话可能会导出失败)。',
            handler: async () => {

            },
        },
        {
            type: 'export-selected',
            title: '选择需要导出的数据',
            desc: '自定义选择导出需要的数据。',
            handler: async () => {
                closeSetting()
                const rows = await check.openToCheck()
                console.log(rows)
            }
        }
    ]

    useTableOptionSettingInner({
        key: eTableOptionSettingView.export,
        title: '导出数据',
        seq: 5,
        beforeOpen() {
            state.exportType = null

        },
        render: () => (
            <div className="pl-table-pro-setting-export">
                <PlArrowStepGroup style={{marginBottom: '20px'}}>
                    <PlArrowStep title="导出方式"/>
                    <PlArrowStep title="导出字段"/>
                    <PlArrowStep title="导出数据"/>
                </PlArrowStepGroup>
                <div>
                    <PlRadioGroup v-model={state.exportType}>
                        {exportOptions.map((option, index) => (
                            <div className="pl-table-pro-setting-export-option" key={index} onClick={() => state.exportType = option.type}>
                                <div className="pl-table-pro-setting-export-option-radio">
                                    <PlRadio val={option.type} customReadonly/>
                                </div>
                                <div className="pl-table-pro-setting-export-option-title">{option.title}</div>
                                <div className="pl-table-pro-setting-export-option-desc">{option.desc}</div>
                            </div>
                        ))}
                    </PlRadioGroup>
                </div>
            </div>
        )
    })
}
