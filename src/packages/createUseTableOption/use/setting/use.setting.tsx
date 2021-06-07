import React from "react";
import useDialog from "../../../useDialog";
import {designComponent} from "plain-design-composition";

export enum eTableOptionSettingView {
    filter = 'filter',
    sort = 'sort',
    config = 'config',
    import = 'import',
    export = 'export',
}

const TableOptionSetting = designComponent({
    props: {},
    setup({props}) {
        return () => (
            <div className="pl-table-pro-setting">
                设置内容
            </div>
        )
    },
})

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
                destroyOnClose: false,
                closeOnCancel: false,
                closeOnConfirm: false,
                footAlign: 'flex-start',
            },
            title: '设置',
            render: () => (<TableOptionSetting/>),
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