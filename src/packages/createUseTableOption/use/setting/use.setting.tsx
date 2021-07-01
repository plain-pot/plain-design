import React from "react";
import useDialog from "../../../useDialog";
import TableOptionSetting, {eTableOptionSettingView} from './TableOptionSetting'
import {tTableOptionHooks} from "../use.hooks";
import {iTableSortData} from "../../createUseTableOption.utils";
import {tTableOptionMethods} from "../use.methods";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {reactive} from "plain-design-composition";

export function useTableOptionSetting({hooks, methods}: {
    hooks: tTableOptionHooks,
    methods: tTableOptionMethods,
}) {

    const $dialog = useDialog()

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        sortData: [] as iTableSortData[],
    })

    hooks.onCollectPlcData.use(plcData => {state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList})
    hooks.onCollectSortData.use(prev => {
        console.log(state.sortData)
        if (!state.sortData) {return prev}
        return [
            ...prev,
            ...state.sortData,
        ]
    })

    const openSetting = (view: eTableOptionSettingView) => {
        $dialog({
            status: null,
            dialogProps: {
                wrapperPadding: false,
                horizontal: 'end',
                fullHeight: true,
                transition: 'pl-transition-dialog-right',
                width: null as any,
                // destroyOnClose: false,
                footAlign: 'flex-start',
                contentPadding: false
            },
            title: '设置',
            render: () => (
                <TableOptionSetting
                    initView={view}
                    plcList={state.getSourceFlatPlcList!()}
                    sortData={state.sortData}
                    onApplySort={(sorts) => {
                        state.sortData = [...sorts]
                        methods.pageMethods.reload()
                    }}
                />),
            cancelButton: true,
            cancelButtonText: '关闭',
        })
    }

    return {openSetting}
}

export type tTableOptionSetting = ReturnType<typeof useTableOptionSetting>