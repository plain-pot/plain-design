import React from "react";
import useDialog from "../../../useDialog";
import {tTableOptionHooks} from "../use.hooks";
import {tTableOptionMethods} from "../use.methods";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {classnames, reactive} from "plain-design-composition";
import {tTableOptionSort} from "../use.sort.state";
import {iTableOptionSettingConfig, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {useTableOptionSettingSort} from "./use.setting.sort";
import './use.setting.scss'
import {useTableOptionSettingFilter} from "./use.setting.filter";
import {useTableOptionSettingConfig} from "./use.setting.config";
import {useTableOptionSettingImport} from "./use.setting.import";
import {useTableOptionSettingExport} from "./use.setting.export";

export function useTableOptionSetting({hooks, methods, sortState}: {
    hooks: tTableOptionHooks,
    methods: tTableOptionMethods,
    sortState: tTableOptionSort,
}) {

    const $dialog = useDialog()

    const state = reactive({
        settingConfigs: [] as iTableOptionSettingConfig[],
        getSourceFlatPlcList: () => [] as tPlc[],
        activeKey: null as null | string,
    })

    const getSourceFlatPlcList = () => state.getSourceFlatPlcList()

    hooks.onCollectPlcData.use(plcData => {state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList.filter(i => !!i.props.field)})

    const useTableOptionSettingInner: iTableOptionSettingInnerUser = (config) => {state.settingConfigs.push(config)}

    useTableOptionSettingFilter({useTableOptionSettingInner})
    useTableOptionSettingSort({hooks, sortState, getSourceFlatPlcList, useTableOptionSettingInner})
    useTableOptionSettingConfig({useTableOptionSettingInner})
    useTableOptionSettingImport({useTableOptionSettingInner})
    useTableOptionSettingExport({useTableOptionSettingInner})

    const openSetting = async (key: string) => {

        for (let config of state.settingConfigs) {!!config.beforeOpen && await config.beforeOpen()}
        const settingConfigs = state.settingConfigs.sort((a, b) => a.seq - b.seq)
        state.activeKey = key

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
            render: () => {
                return (
                    <div className="pl-table-pro-setting">
                        <div className="pl-table-pro-setting-nav">
                            {[null, ...settingConfigs, null].map((item, index) => (
                                <div className={classnames([
                                    'pl-table-pro-setting-nav-item',
                                    {
                                        'pl-table-pro-setting-nav-item-active': !!item && item.key === state.activeKey,
                                        'pl-table-pro-setting-nav-item-prev': !!settingConfigs[index] && settingConfigs[index].key === state.activeKey,
                                        'pl-table-pro-setting-nav-item-next': !!settingConfigs[index - 2] && settingConfigs[index - 2].key === state.activeKey,
                                    }
                                ])} key={index} onClick={() => !!item && (state.activeKey = item.key)}>
                                    <div className="pl-table-pro-setting-nav-item-inner">
                                        {item?.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="pl-table-pro-setting-content">
                            {(() => {
                                const r = settingConfigs.find(i => i.key === state.activeKey)
                                return !!r && !!r.render && r.render()
                            })()}
                        </div>
                    </div>
                )
            },
            cancelButton: true,
            cancelButtonText: '关闭',
        })
        return {openSetting}
    }

    return {openSetting}
}

export type tTableOptionSetting = ReturnType<typeof useTableOptionSetting>
