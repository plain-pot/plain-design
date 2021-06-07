import React from "react";
import useDialog from "../../../useDialog";
import TableOptionSetting, {eTableOptionSettingView} from './TableOptionSetting'
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {tTableOptionHooks} from "../use.hooks";
import PlTable from "../../../PlTable";

export function useTableOptionSetting({hooks}: { hooks: tTableOptionHooks }) {

    const $dialog = useDialog()

    const state = {
        table: {} as typeof PlTable.use.class,
    }

    hooks.onRefTable.use(table => {state.table = table})

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
            render: () => (<TableOptionSetting initView={view} plcList={state.table.plcData.value!.flatPlcList}/>),
            cancelButton: true,
            cancelButtonText: '关闭',
        })
    }

    return {openSetting}
}

export type tTableOptionSetting = ReturnType<typeof useTableOptionSetting>