import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import './use.setting.export.scss'
import {tTableOptionCheck} from "../check/use.check";

interface ExportOption {
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

    const exportOptions: ExportOption[] = [
        {
            title: '导出当前页数据',
            desc: '将表格当前展示的数据导出。',
            handler: async () => {

            }
        },
        {
            title: '导出当前所有数据',
            desc: '根据当前的筛选排序条件导出所有数据(数据量比较大的话可能会导出失败)。',
            handler: async () => {

            },
        },
        {
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
        render: () => (
            <div className="pl-table-pro-setting-export">
                {exportOptions.map((option, index) => (
                    <div className="pl-table-pro-setting-export-option" key={index} onClick={option.handler}>
                        <div className="pl-table-pro-setting-export-option-title">{option.title}</div>
                        <div className="pl-table-pro-setting-export-option-desc">{option.desc}</div>
                    </div>
                ))}
            </div>
        )
    })
}
