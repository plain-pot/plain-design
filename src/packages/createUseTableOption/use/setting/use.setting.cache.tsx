import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {tTableOptionCache} from "../use.cache";
import React from "react";
import {reactive} from "plain-design-composition";
import {iTableOptionCacheData, iTableOptionCacheItemData} from "../use.cache.utils";
import {deepcopy} from "plain-utils/object/deepcopy";
import PlTable from "../../../PlTable";
import {PlcIndex} from "../../../PlcIndex";
import {Plc} from "../../../Plc";
import PlcOperator from "../../../PlcOperator";
import PlButton from "../../../PlButton";
import useDialog, {DialogServiceOption} from "../../../useDialog";
import {defer} from "../../../../utils/defer";
import useMessage from "../../../useMessage";
import PlButtonGroup from "../../../PlButtonGroup";
import PlRadio from "../../../PlRadio";

export function useTableOptionSettingCache(
    {
        useTableOptionSettingInner, cache
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        cache: tTableOptionCache,
    }
) {

    const $dialog = useDialog()
    const $message = useMessage()

    const state = reactive({
        editCacheData: {} as iTableOptionCacheData
    })

    const getConfigName = (initialName?: string) => {
        const dfd = defer<string>()

        const dlgOpt: DialogServiceOption = {
            editType: 'input',
            status: null,
            editValue: initialName,
            title: '请输入配置名称',
            confirmButton: true,
            cancelButton: true,
            onConfirm: editValue => {
                if (editValue == null || String(editValue).trim().length === 0) {
                    $message('请输入新配置名称')
                } else {
                    dfd.resolve(editValue);
                    (dlgOpt as any).close()
                }
            },
            dialogProps: {
                closeOnConfirm: false,
            }
        }
        $dialog(dlgOpt)

        return dfd.promise
    }

    const newCache = async () => {
        const cacheName = await getConfigName()
        cache.createCache(cacheName)
        state.editCacheData = deepcopy(cache.state.cacheData)
    }

    const renameCache = async (cacheItemData: iTableOptionCacheItemData) => {
        const newCacheName = await getConfigName(cacheItemData.title)
        cache.renameCache(cacheItemData.id, newCacheName)
        state.editCacheData = deepcopy(cache.state.cacheData)
    }

    const deleteCache = async (cacheItemData: iTableOptionCacheItemData) => {
        cache.deleteCache(cacheItemData.id)
        state.editCacheData = deepcopy(cache.state.cacheData)
    }

    const copyConfig = async (cacheItemData: iTableOptionCacheItemData) => {
        cache.copyCache(cacheItemData.id, await getConfigName(cacheItemData.title + '[副本]'))
        state.editCacheData = deepcopy(cache.state.cacheData)
    }

    const overrideCache = async (cacheItemData: iTableOptionCacheItemData) => {
        await $dialog.confirm({message: `确定要覆盖配置"${cacheItemData.title}"为当前最新的配置吗？`})
        cache.overrideCache(cacheItemData.id)
        state.editCacheData = deepcopy(cache.state.cacheData)
    }

    const applyCache = async (cacheItemData?: iTableOptionCacheItemData) => {
        cache.applyCache(cacheItemData?.id)
        state.editCacheData = deepcopy(cache.state.cacheData)
    }

    useTableOptionSettingInner({
        key: eTableOptionSettingView.cache,
        title: '缓存设置',
        seq: 4,
        beforeOpen: () => {
            state.editCacheData = deepcopy(cache.state.cacheData)
        },
        render: () => {
            return (
                <div>
                    <div style={{marginBottom: '16px'}}>
                        <PlButton label="保存当前状态为新的缓存配置" mode="text" icon="el-icon-plus" onClick={newCache}/>
                    </div>
                    <PlTable data={state.editCacheData.data}>
                        <PlcIndex/>
                        <Plc align="center" width={50} noPadding>
                            {{
                                normal: ({row}) => {
                                    return <PlRadio modelValue={row.id === state.editCacheData.activeId} customReadonly/>
                                }
                            }}
                        </Plc>
                        <Plc title="缓存名称" field="title"/>
                        <Plc title="更新时间" field="time"/>
                        <PlcOperator>
                            {{
                                default: ({row}) => {
                                    return (
                                        <PlButtonGroup mode="text" size="mini">
                                            <PlButton label="应用" onClick={() => applyCache(row as any)}/>
                                            <PlButton label="重命名" onClick={() => renameCache(row as any)}/>
                                            <PlButton label="删除" onClick={() => deleteCache(row as any)}/>
                                            <PlButton label="覆盖" onClick={() => overrideCache(row as any)}/>
                                            <PlButton label="复制" onClick={() => copyConfig(row as any)}/>
                                        </PlButtonGroup>
                                    )
                                }
                            }}
                        </PlcOperator>
                    </PlTable>
                </div>
            )
        },
    })

}