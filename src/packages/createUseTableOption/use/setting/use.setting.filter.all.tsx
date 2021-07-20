import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";

export function useTableOptionSettingAllFilter({useTableOptionSettingInner}: { useTableOptionSettingInner: iTableOptionSettingInnerUser }) {
    useTableOptionSettingInner({
        key: eTableOptionSettingView.allFilter,
        title: '所有筛选',
        seq: 0.9,
        render: () => <>
            所有筛选
        </>
    })
}
