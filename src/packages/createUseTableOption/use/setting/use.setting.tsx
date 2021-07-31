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
import {useTableOptionSettingSeniorFilter} from "./use.setting.filter.senior";
import {useTableOptionSettingConfig} from "./use.setting.config";
import {useTableOptionSettingImport} from "./use.setting.import";
import {useTableOptionSettingExport} from "./use.setting.export";
import {useTableOptionSettingAllFilter} from "./use.setting.filter.all";
import {tTableOptionFilter} from "../use.filter.state";
import {tTableOptionCache} from "../use.cache";
import {useTableOptionSettingCache} from "./use.setting.cache";

export function useTableOptionSetting({hooks, methods, sortState, filterState, cache}: {
    hooks: tTableOptionHooks,
    methods: tTableOptionMethods,
    sortState: tTableOptionSort,
    filterState: tTableOptionFilter,
    cache: tTableOptionCache,
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

    useTableOptionSettingAllFilter({useTableOptionSettingInner, filterState})
    useTableOptionSettingSeniorFilter({useTableOptionSettingInner, getSourceFlatPlcList, methods, hooks, cache, filterState})
    useTableOptionSettingSort({hooks, sortState, getSourceFlatPlcList, useTableOptionSettingInner})
    useTableOptionSettingConfig({useTableOptionSettingInner, getSourceFlatPlcList, cache, hooks})
    useTableOptionSettingCache({useTableOptionSettingInner, cache})
    useTableOptionSettingImport({useTableOptionSettingInner})
    useTableOptionSettingExport({useTableOptionSettingInner})

    const openSetting = async (key: string) => {

        const settingConfigs = state.settingConfigs.sort((a, b) => a.seq - b.seq)
        state.activeKey = key
        const showConfig = state.settingConfigs.find(i => i.key === key)
        !!showConfig && showConfig.beforeOpen && (await showConfig.beforeOpen())

        $dialog({
            status: null,
            dialogProps: {
                wrapperPadding: false,
                horizontal: 'end',
                fullHeight: true,
                transition: 'pl-transition-dialog-right',
                width: null as any,
                /*
                *  设置为false，读取不了宽度，会导致表格渲染不出来，设置为true，会导致在显示表单的时候过渡动画异常。
                */
                destroyOnClose: false,
                footAlign: 'flex-start',
                contentPadding: false,
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
                                ])} key={index} onClick={async () => {
                                    if (!item) {return}
                                    !!item.beforeOpen && (await item.beforeOpen())
                                    state.activeKey = item.key
                                }}>
                                    <div className="pl-table-pro-setting-nav-item-inner">
                                        {item?.title}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {(() => {
                            const r = settingConfigs.find(i => i.key === state.activeKey)
                            const content = !!r && !!r.render && r.render()
                            return (
                                <div className={classnames(['pl-table-pro-setting-content', {'pl-table-pro-setting-content-pending': !!r && r.contentPending !== false}])}>
                                    {content}
                                </div>
                            )
                        })()}
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
