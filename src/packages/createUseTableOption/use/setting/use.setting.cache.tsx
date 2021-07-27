import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {tTableOptionCache} from "../use.cache";
import React from "react";
import {reactive} from "plain-design-composition";
import {iTableOptionCacheData} from "../use.cache.utils";
import {deepcopy} from "plain-utils/object/deepcopy";
import PlTable from "../../../PlTable";
import {PlcIndex} from "../../../PlcIndex";
import {Plc} from "../../../Plc";
import PlcOperator from "../../../PlcOperator";
import PlButton from "../../../PlButton";
import useDialog, {DialogServiceFormatOption, DialogServiceOption} from "../../../useDialog";
import {defer} from "../../../../utils/defer";
import useMessage from "../../../useMessage";
import PlButtonGroup from "../../../PlButtonGroup";

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
                    $message('请输入配置名称')
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

    const newCacheConfig = async () => {
        const cacheName = await getConfigName()
        state.editCacheData.data.unshift(cache.createCache(cacheName))
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
                        <PlButton label="保存当前状态为新的缓存配置" mode="text" icon="el-icon-plus" onClick={newCacheConfig}/>
                    </div>
                    <PlTable data={state.editCacheData.data}>
                        <PlcIndex/>
                        <Plc title="缓存名称" field="title"/>
                        <Plc title="更新时间" field="time"/>
                        <PlcOperator>
                            {{
                                default: ({row}) => {
                                    return (
                                        <PlButtonGroup mode="text" size="mini">
                                            <PlButton label="应用"/>
                                            <PlButton label="重命名"/>
                                            <PlButton label="删除"/>
                                            <PlButton label="覆盖"/>
                                            <PlButton label="复制"/>
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