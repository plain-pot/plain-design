import React from "react";
import useDialog from "../../../useDialog";
import TableOptionSetting, {eTableOptionSettingView} from './TableOptionSetting'
import {tTableOptionHooks} from "../use.hooks";
import PlTable from "../../../PlTable";
import {tTableOptionChangeSort, tTableOptionConfig} from "../../createUseTableOption.utils";
import {deepcopy} from "plain-utils/object/deepcopy";
import {tTableOptionMethods} from "../use.methods";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";

export function useTableOptionSetting({hooks, config, changeSort, methods}: {
    hooks: tTableOptionHooks,
    config: tTableOptionConfig,
    changeSort: tTableOptionChangeSort,
    methods: tTableOptionMethods,
}) {

    const $dialog = useDialog()

    const state = {
        getSourceFlatPlcList: null as null | (() => tPlc[])
    }

    hooks.onRefTable.use(table => {state.getSourceFlatPlcList = () => table.plcData.value!.sourceFlatPlcList})

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
                    sortData={config.sort}
                    onApplySort={(sorts) => {
                        changeSort(sorts.map(({field, desc}) => ({field, desc})))
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