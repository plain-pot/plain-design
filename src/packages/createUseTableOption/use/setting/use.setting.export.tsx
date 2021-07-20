import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";

export function useTableOptionSettingExport({useTableOptionSettingInner}: { useTableOptionSettingInner: iTableOptionSettingInnerUser }) {
    useTableOptionSettingInner({
        key: eTableOptionSettingView.export,
        title: '导出数据',
        seq: 5,
        render: () => <>
            导出
        </>
    })
}
