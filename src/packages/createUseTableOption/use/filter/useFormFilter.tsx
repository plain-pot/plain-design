import {computed, reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption, iFilterQuery, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import {tTableOptionHooks} from "../use.hooks";
import {tTableOptionMethods} from "../use.methods";
import {toArray} from "../../../../utils/toArray";
import PlForm from "../../../PlForm";
import React from "react";
import PlFilter from "../../../PlFilter";
import PlFormItem from "../../../PlFormItem";
import {tTableOptionFilter} from "../use.filter.state";
import {createFilterOptionByPlc, getPlcKey, iFilterCacheData} from "./use.filter.utils";

export function useTableOptionFormFilter({hooks, methods, filterState}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, filterState: tTableOptionFilter }) {

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        isShow: false,
    })

    const data = filterState.useState<iFilterOption[], Record<string, iFilterCacheData>>({
        key: 'form-filter',
        title: '表单查询',
        state: [],
        onReady(flatPlcList, cacheData) {
            state.getSourceFlatPlcList = () => flatPlcList
            cacheData = cacheData || {}
            data.state = flatPlcList.map(plc => {
                const key = getPlcKey(plc)
                if (!!cacheData[key]) {
                    return {...cacheData[key]!, plc, filterConfig: plc.props.filterConfig}
                } else {
                    return createFilterOptionByPlc(plc)
                }
            })
        },
        getActiveFilterCount: () => {
            if (ftoArr.value.length === 0) {return 0}
            return ftoArr.value.reduce((prev: number, fto: iFilterTargetOption) => {
                const queries = FilterConfig.formatToQuery(fto)
                return prev + (!!queries && toArray(queries).length > 0 ? 1 : 0)
            }, 0)
        },
        display: () => <>
            表单查询
        </>,
        clear: () => {
            if (!data.state) {return}
            data.state.forEach(fo => {
                fo.value = null
                fo.handlerName = fo.plc!.props.filterHandler
            })
        },
        getCacheData: (): Record<string, iFilterCacheData> => {
            if (!data.state) {return {}}
            return data.state.reduce((prev, fo) => {
                const key = getPlcKey(fo.plc!)
                const {plc, filterConfig, ...left} = fo
                prev[key] = left
                return prev
            }, {} as Record<string, iFilterCacheData>)
        },
    })

    const ftoArr = computed((): iFilterTargetOption[] => data.state.map(i => FilterConfig.getTargetOption(i)).filter(Boolean) as iFilterTargetOption[])

    hooks.onCollectFilterData.use(async data => {
        if (ftoArr.value.length === 0) {return data}
        const queries = ftoArr.value.reduce((prev, fto) => {
            const queries = fto.handler.transform(fto)
            if (!!queries) {
                prev.push(...toArray(queries))
            }
            return prev
        }, [] as iFilterQuery[])
        return !!queries && queries.length > 0 ? [...data, {queries: toArray(queries),}] : data
    })

    const filterMethods = {
        expand: () => state.isShow = true,
        collapse: () => state.isShow = false,
        toggle: () => state.isShow = !state.isShow,
    }

    const formData = computed(() => ftoArr.value.reduce((prev, item, index) => {
        prev[index] = item.option.value
        return prev
    }, {} as Record<number, any>))

    const handler = {
        onHandlerChange: () => {
            // console.log('handler change')
            // state.ftoArr = getFtoArr(state.getSourceFlatPlcList!())
        },
        onFilterConfirm: () => {
            methods.pageMethods.reload()
        },
    }

    hooks.onTableRender.use(prev => [
        ...prev,
        {
            seq: 9,
            render: () => {
                if (ftoArr.value.length == 0) {return null}
                if (!state.isShow) {return null}

                return (
                    <PlForm modelValue={formData.value} column={3} contentWidth={260} labelAlign="right">
                        {ftoArr.value.map((fto, index) => (
                            <PlFormItem label={fto.option.label} key={index}>
                                <PlFilter
                                    fto={fto}
                                    key={fto.filter.filterName + fto.handler.handlerName}
                                    hideSearchButton
                                    block
                                    onHandlerNameChange={handler.onHandlerChange}
                                    onConfirm={handler.onFilterConfirm}
                                />
                            </PlFormItem>
                        ))}
                    </PlForm>
                )
            }
        }
    ])

    return {
        ...filterMethods,
        state,
    }
}
