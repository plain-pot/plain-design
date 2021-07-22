import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {computed, reactive} from "plain-design-composition";
import {FilterConfig, iFilterOption, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import PlButton from "../../../PlButton";
import PlDropdown from "../../../PlDropdown";
import {tTableOptionHooks} from "../use.hooks";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import PlIcon from "../../../PlIcon";
import PlDropdownMenu from "../../../PlDropdownMenu";
import PlDropdownOption from "../../../PlDropdownOption";
import {createFilterOptionByPlc} from "../filter/use.filter.utils";
import PlEmpty from "../../../PlEmpty";
import PlFilter from "../../../PlFilter";
import {tTableOptionMethods} from "../use.methods";
import './use.setting.filter.senior.scss'
import PlCheckbox from "../../../PlCheckbox";
import PlInput from "../../../PlInput";

interface iSeniorFilterData extends iFilterOption {
    id: string
}

export function useTableOptionSettingSeniorFilter(
    {
        useTableOptionSettingInner,
        hooks,
        getSourceFlatPlcList,
        methods,
    }: {
        useTableOptionSettingInner: iTableOptionSettingInnerUser,
        hooks: tTableOptionHooks,
        getSourceFlatPlcList: () => tPlc[],
        methods: tTableOptionMethods,
    }) {

    const state = reactive({
        data: [] as iSeniorFilterData[],
        operator: null as null | string,
        customOperator: false,
    })

    const utils = {
        nextId: (() => {
            let count = 1
            return () => `F_${count++}`
        })(),
        resetOperator: () => {
            state.operator = state.data.map(i => i.id).join(' 或者 ')
        },
    }

    const handler = {
        add: (plc: tPlc) => {

            const id = utils.nextId()

            if (state.data.length === 0) {
                state.operator = id
            } else {
                state.operator += ` 并且 ${id}`
            }

            state.data.push({id, ...createFilterOptionByPlc(plc)})
        },
        apply: () => {
            methods.pageMethods.reload()
        },
        clear: () => {
            state.data = []
            state.operator = null
        },
    }

    const ftoArr = computed(() => state.data.map(i => FilterConfig.getTargetOption(i)).filter(Boolean) as (Omit<iFilterTargetOption, 'option'> & { option: iSeniorFilterData })[])

    useTableOptionSettingInner({
        key: eTableOptionSettingView.seniorFilter,
        title: '高级筛选',
        seq: 1,
        render: () => <>
            <div className="pl-table-pro-setting-senior-filter">
                <div className="pl-table-pro-setting-senior-filter-button">
                    <div>
                        <PlButton label="应用" onClick={handler.apply}/>
                        <PlDropdown>
                            {{
                                reference: ({open}) => (
                                    <PlButton style={{marginBottom: '16px'}}>
                                        <span>新增筛选</span>
                                        <PlIcon icon={'el-icon-arrow-down'} style={{transition: 'transform 200ms linear', transform: `rotateX(${open ? 180 : 0}deg)`,}}/>
                                    </PlButton>
                                ),
                                popper: <PlDropdownMenu>
                                    {getSourceFlatPlcList().filter(i => !!i.props.field && !!i.props.title).map((plc, index) => (
                                        <PlDropdownOption label={plc.props.title} key={index} onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                            handler.add(plc)
                                        }}/>
                                    ))}
                                </PlDropdownMenu>
                            }}
                        </PlDropdown>
                        <PlCheckbox label="自定义查询表达式" v-model={state.customOperator} onChange={utils.resetOperator}/>
                    </div>
                    <PlButton label="清空" mode="stroke" status="error" onClick={handler.clear}/>
                </div>
                <div className="pl-table-pro-setting-senior-filter-list">
                    {state.customOperator && (
                        <div className="pl-table-pro-setting-senior-filter-item" key='operator'>
                            <div className="pl-table-pro-setting-senior-filter-item-id" style={{verticalAlign: 'top', lineHeight: '32px'}}>
                                <span>表达式</span>
                            </div>
                            <div className="pl-table-pro-setting-senior-filter-item-content">
                                <PlInput textarea v-model={state.operator} block/>
                            </div>
                        </div>
                    )}

                    {ftoArr.value.length === 0 && (
                        <div className="pl-table-pro-setting-senior-filter-empty">
                            <PlEmpty label="暂无筛选..."/>
                        </div>
                    )}
                    {ftoArr.value.map((fto, index) => (
                        <div className="pl-table-pro-setting-senior-filter-item" key={index}>
                            <div className="pl-table-pro-setting-senior-filter-item-id">
                                {fto.option.id}
                            </div>
                            <div className="pl-table-pro-setting-senior-filter-item-content">
                                <PlFilter
                                    fto={fto}
                                    key={fto.filter.filterName + fto.handler.handlerName}
                                    hideSearchButton
                                    block
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    })
}
