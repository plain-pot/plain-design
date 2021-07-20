import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";

export function useTableOptionSettingFilter({useTableOptionSettingInner}: { useTableOptionSettingInner: iTableOptionSettingInnerUser }) {
    useTableOptionSettingInner({
        key: eTableOptionSettingView.filter,
        title: '高级筛选',
        seq: 1,
        render: () => <>
            筛选
        </>
    })
}
