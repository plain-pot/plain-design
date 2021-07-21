import {computed, reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption} from "../../../PlFilter/FilterConfig";
import {toArray} from "../../../../utils/toArray";
import PlFilter from "../../../PlFilter";
import PlSelect from "../../../PlSelect";
import PlSelectOption from "../../../PlSelectOption";
import PlTooltip from "../../../PlTooltip";
import PlButton from "../../../PlButton";
import React from "react";
import {tTableOptionHooks} from "../use.hooks";
import {tTableOptionMethods} from "../use.methods";
import {tTableOptionFilter} from "../use.filter.state";
import {createFilterOptionByPlc, iFilterCacheData} from "./use.filter.utils";
import {tTableOptionSetting} from "../setting/use.setting";
import {eTableOptionSettingView} from "../setting/use.setting.utils";

export function useTableOptionSearchFilter({hooks, methods, filterState, setting, onCollapse, isCollapse}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, filterState: tTableOptionFilter, setting: tTableOptionSetting, onCollapse: () => void, isCollapse: () => boolean }) {

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),                        // 原始列信息对象
    })

    const data = filterState.useState<iFilterOption | null, iFilterCacheData | null>({
        state: null,
        key: 'search-filter',
        title: '搜索栏',
        onReady(flatPlcList, cacheData) {

            let fo: iFilterOption | null = null

            let defaultPlc: tPlc | null = flatPlcList[0];
            let cachePlc: tPlc | null = null;

            flatPlcList.forEach(i => {
                if (!!cacheData) {
                    if (i.props.title === cacheData.label && i.props.field === cacheData.field) {
                        cachePlc = i
                    }
                }
                if (i.props.defaultSearch) {
                    defaultPlc = i
                }
            })

            if (!!cachePlc) {
                fo = {...cacheData!, plc: cachePlc, filterConfig: cachePlc!.props.filterConfig}
            } else if (!!defaultPlc) {
                fo = createFilterOptionByPlc(defaultPlc)
            }

            if (!!fo) {
                data.state = fo
            }

            state.getSourceFlatPlcList = () => flatPlcList
        },
        getActiveFilterCount: () => {
            if (!filterTargetOption.value) {return 0}
            const queries = FilterConfig.formatToQuery(filterTargetOption.value)
            return (!!queries && toArray(queries).length > 0 ? 1 : 0)
        },
        getDisplay: () => {
            return () => render({showAllFilterButton: false, showFormFilterExpander: false, width: '100%'})
        },
        clear: () => {
            if (!data.state) {return}
            FilterConfig.clearFoValue(data.state)
        },
        getCacheData: (): iFilterCacheData | null => {
            if (!data.state) {return null}
            const {plc, filterConfig, ...left} = data.state as iFilterOption
            return left
        },
    })

    const filterTargetOption = computed(() => !!data.state ? FilterConfig.getTargetOption(data.state) : null)

    const onFieldChange = (field: string) => {
        const plc = state.getSourceFlatPlcList!().find(i => i.props.field === field)!
        data.state = createFilterOptionByPlc(plc)
    }
    const onConfirm = () => methods.pageMethods.reload()

    hooks.onCollectFilterData.use(async data => {
        if (!filterTargetOption.value) {return data}
        const queries = filterTargetOption.value.handler.transform(filterTargetOption.value)
        return !!queries ? [...data, {queries: toArray(queries),}] : data
    })

    const render = (config?: { showFormFilterExpander?: boolean, showAllFilterButton?: boolean, width?: string }) => {

        config = config || {}

        const fto = filterTargetOption.value
        if (!fto || !state.getSourceFlatPlcList) {return null}
        const columns = state.getSourceFlatPlcList()
        return (
            <div>
                <div className="pl-table-pro-filter-bar" style={{width: config?.width || '600px', display: 'inline-block'}}>
                    <PlFilter
                        fto={fto}
                        key={fto.option.field + fto.option.label + fto.option.filterName + fto.option.handlerName}
                        onConfirm={onConfirm}
                        block>
                        {{
                            prepend: () => <PlSelect
                                className="pl-filter-ele"
                                inputProps={{width: '120px'}}
                                v-model={fto.option.field}
                                onChange={onFieldChange as any}>
                                {
                                    columns.map((plc, index) => !plc.props.field ? null : <PlSelectOption
                                        label={plc.props.title || ''}
                                        val={plc.props.field}
                                        key={index}/>)
                                }
                            </PlSelect>,
                            append: () => (
                                config!.showFormFilterExpander === false ? null : (
                                    <PlTooltip title="展开/折叠 · 表单查询">
                                        <PlButton className="pl-filter-ele" icon={`el-icon-arrow-${isCollapse() ? 'down' : 'up'}`} style={{borderLeftColor: 'rgba(255,255,255,0.65)'}} onClick={onCollapse}/>
                                    </PlTooltip>
                                )
                            )
                        }}
                    </PlFilter>
                </div>
                {config.showAllFilterButton !== false && filterState.state.activeCount > 0 && (
                    <PlButton style={{margin: '0 8px'}} mode="text" label={`所有筛选(${filterState.state.activeCount})`} onClick={() => setting.openSetting(eTableOptionSettingView.allFilter)}/>
                )}
            </div>
        )
    }

    return {
        state,
        render,
    }
}
