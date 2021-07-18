import React from "react";
import useDialog from "../../../useDialog";
import TableOptionSetting, {eTableOptionSettingView} from './TableOptionSetting'
import {tTableOptionHooks} from "../use.hooks";
import {iTableSortData} from "../../createUseTableOption.utils";
import {tTableOptionMethods} from "../use.methods";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {reactive} from "plain-design-composition";
import {tTableOptionSort} from "../use.sort";

export function useTableOptionSetting({hooks, methods, tableSort}: {
    hooks: tTableOptionHooks,
    methods: tTableOptionMethods,
    tableSort: tTableOptionSort,
}) {

    const $dialog = useDialog()

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        sortData: [] as iTableSortData[],
    })

    hooks.onCollectPlcData.use(plcData => {state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList})
    hooks.onCollectSortData.use(prev => {
        if (!state.sortData) {return prev}
        return [
            ...prev,
            ...state.sortData,
        ]
    })

    const openSetting = (view: eTableOptionSettingView) => {

        const getConfig = () => ({
            tableSort,
            plcList: state.getSourceFlatPlcList!(),
        })

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
                    getConfig={getConfig}
                />),
            cancelButton: true,
            cancelButtonText: '关闭',
        })
    }

    return {openSetting}
}

export type tTableOptionSetting = ReturnType<typeof useTableOptionSetting>