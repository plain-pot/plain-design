import React from "react";
import useDialog from "../../../useDialog";
import TableOptionSetting, {eTableOptionSettingView} from './TableOptionSetting'

export function useTableOptionSetting() {

    const $dialog = useDialog()

    const openSetting = (view: eTableOptionSettingView) => {
        const dialog = $dialog({
            status: null,
            dialogProps: {
                wrapperPadding: false,
                horizontal: 'end',
                fullHeight: true,
                transition: 'pl-transition-dialog-right',
                width: null as any,
                // destroyOnClose: false,
                closeOnCancel: false,
                closeOnConfirm: false,
                footAlign: 'flex-start',
                contentPadding: false
            },
            title: '设置',
            render: () => (<TableOptionSetting initView={view}/>),
            confirmButton: true,
            cancelButton: true,
            onConfirm: () => {
                console.log('xxx')
            },
            onCancel: () => {
                console.log('ccc')
                dialog.close()
            },
        })
    }

    return {openSetting}
}

export type tTableOptionSetting = ReturnType<typeof useTableOptionSetting>