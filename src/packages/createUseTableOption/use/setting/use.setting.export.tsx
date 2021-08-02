import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import './use.setting.export.scss'
import {tTableOptionCheck} from "../check/use.check";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import PlRadioGroup from "../../../PlRadioGroup";
import {reactive, useRefs} from "plain-design-composition";
import PlRadio from "../../../PlRadio";
import PlArrowStepGroup from "../../../PlArrowStepGroup";
import PlArrowStep from "../../../PlArrowStep";
import PlButton from "../../../PlButton";
import {deepcopy} from "plain-utils/object/deepcopy";
import useMessage from "../../../useMessage";
import PlTable from "../../../PlTable";
import {Plc} from "../../../Plc";
import PlcCheckRow from "../../../PlcCheckRow";
import PlLoading from "../../../PlLoading";
import PlIcon from "../../../PlIcon";
import {delay} from "plain-utils/utils/delay";

interface ExportOption {
    type: string,
    title: string,
    desc: string,
    handler: (list: ExportPlcData[]) => Promise<void>,
}

interface ExportPlcData {
    title?: string
    field: string
}

export function useTableOptionSettingExport(
    {
        useTableOptionSettingInner,
        closeSetting,
        check,
        getSourceFlatPlcList,
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        closeSetting: () => void,
        check: tTableOptionCheck,
        getSourceFlatPlcList: () => tPlc[],
    }) {

    const $message = useMessage()

    const {refs, onRef} = useRefs({
        check: PlcCheckRow,
    })

    const initialState = {
        exportType: null as null | string,
        step: 0,
        stepStatus: undefined as undefined | string,

        plcList: [] as ExportPlcData[],           // 可选的导出的字段数组
        selectPlcList: [] as ExportPlcData[],     // 已经选中的plc数组
    }

    const state = reactive({
        ...deepcopy(initialState),
    })

    const exportOptions: ExportOption[] = [
        {
            type: 'export-page',
            title: '导出当前页数据',
            desc: '将表格当前展示的数据导出。',
            handler: async () => {
                await delay(3000)

            }
        },
        {
            type: 'export-all',
            title: '导出当前所有数据',
            desc: '根据当前的筛选排序条件导出所有数据(数据量比较大的话可能会导出失败)。',
            handler: async () => {
                await delay(3000)
                throw new Error('error')
            },
        },
        {
            type: 'export-selected',
            title: '选择需要导出的数据',
            desc: '自定义选择导出需要的数据。',
            handler: async () => {
                closeSetting()
                const rows = await check.openToCheck()
                console.log(rows)
            }
        }
    ]

    const nextStep = async () => {
        switch (state.step) {
            case 0:
                if (!state.exportType) {
                    return $message.error('请选择一项导出方式！')
                }
                state.step++
                break
            case 1:
                state.selectPlcList = refs.check!.getSelected() as any
                if (state.selectPlcList.length === 0) {
                    return $message.error('请选择要导出的字段！')
                }
                state.step++
                const exportType = exportOptions.find(i => i.type === state.exportType)!
                try {
                    await exportType.handler(state.selectPlcList)
                    state.stepStatus = 'success'
                } catch (e) {
                    state.stepStatus = 'error'
                    console.error(e)
                }

                break
        }
    }

    const prevStep = () => {
        if (state.step === 1) {
            state.selectPlcList = refs.check!.getSelected() as any
        }
        state.step--
    }

    const restart = () => {
        Object.assign(state, deepcopy(initialState))

        state.plcList = getSourceFlatPlcList().map((i) => ({
            title: i.props.title,
            field: i.props.field!,
        }))
        // 默认选中所有字段
        state.selectPlcList = deepcopy(state.plcList)
    }

    useTableOptionSettingInner({
        key: eTableOptionSettingView.export,
        title: '导出数据',
        seq: 5,
        beforeOpen() {
            restart()
        },
        render: () => (
            <div className="pl-table-pro-setting-export">
                <PlArrowStepGroup style={{marginBottom: '20px'}} current={state.step} currentStatus={state.stepStatus}>
                    <PlArrowStep title="导出方式"/>
                    <PlArrowStep title="导出字段"/>
                    <PlArrowStep title="导出数据"/>
                </PlArrowStepGroup>
                <div>
                    {state.step === 0 && (
                        <PlRadioGroup v-model={state.exportType}>
                            {exportOptions.map((option, index) => (
                                <div className="pl-table-pro-setting-export-option" key={index} onClick={() => state.exportType = option.type}>
                                    <div className="pl-table-pro-setting-export-option-radio">
                                        <PlRadio val={option.type} customReadonly/>
                                    </div>
                                    <div className="pl-table-pro-setting-export-option-title">{option.title}</div>
                                    <div className="pl-table-pro-setting-export-option-desc">{option.desc}</div>
                                </div>
                            ))}
                        </PlRadioGroup>
                    )}
                    {state.step === 1 && (
                        <PlTable data={state.plcList} showRows={Math.max(state.plcList.length, 5)} keyField="field">
                            <PlcCheckRow
                                toggleOnClickRow
                                ref={onRef.check}
                                selected={state.selectPlcList}
                            />
                            <Plc title="字段名称" field="title"/>
                        </PlTable>
                    )}
                    {state.step === 2 && (
                        <div className="pl-table-pro-setting-export-loading">
                            {!state.stepStatus && <>
                                <PlLoading status="primary"/>
                                <span>正在导出数据！</span>
                            </>}
                            {state.stepStatus === 'success' && <>
                                <PlIcon icon="el-icon-check-bold" status="success"/>
                                <span>导出完毕！</span>
                            </>}
                            {state.stepStatus === 'error' && <>
                                <PlIcon icon="el-icon-close-bold" status="error"/>
                                <span>导出失败！</span>
                            </>}
                            {!!state.stepStatus && (
                                <PlButton label="再次导出" onClick={restart}/>
                            )}
                        </div>
                    )}
                </div>
                <div className="pl-table-pro-setting-export-foot">
                    {state.step === 1 && <PlButton mode='stroke' label="上一步" onClick={prevStep}/>}
                    {state.step < 2 && <PlButton label="下一步" onClick={nextStep}/>}
                </div>
            </div>
        )
    })
}
