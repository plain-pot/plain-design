import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";

export function useTableOptionSettingImport({useTableOptionSettingInner}: { useTableOptionSettingInner: iTableOptionSettingInnerUser }) {
    useTableOptionSettingInner({
        key: eTableOptionSettingView.import,
        title: '导入数据',
        seq: 4,
        render: () => <>
            导入
        </>
    })
}
