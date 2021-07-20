import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";

export function useTableOptionSettingConfig({useTableOptionSettingInner}: { useTableOptionSettingInner: iTableOptionSettingInnerUser }) {
    useTableOptionSettingInner({
        key: eTableOptionSettingView.config,
        title: '个性设置',
        seq: 3,
        render: () => <>
            设置
        </>
    })
}
