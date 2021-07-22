import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {reactive} from "plain-design-composition";
import {iFilterOption} from "../../../PlFilter/FilterConfig";


interface iSeniorFilterData extends iFilterOption {
    id: string
}

export function useTableOptionSettingSeniorFilter({useTableOptionSettingInner}: { useTableOptionSettingInner: iTableOptionSettingInnerUser }) {

    const state = reactive({
        seniorList: [] as iSeniorFilterData[],
        operator: null as null | string,
    })

    useTableOptionSettingInner({
        key: eTableOptionSettingView.seniorFilter,
        title: '高级筛选',
        seq: 1,
        render: () => <>
            筛选
        </>
    })
}
