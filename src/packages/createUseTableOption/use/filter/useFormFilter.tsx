import {reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption, iFilterQuery, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import {tTableOptionHooks} from "../use.hooks";
import {tTableOptionMethods} from "../use.methods";
import {defer} from "../../../../utils/defer";
import {toArray} from "../../../../utils/toArray";
import PlForm from "../../../PlForm";
import React from "react";
import PlFilter from "../../../PlFilter";
import PlFormItem from "../../../PlFormItem";
import {computed} from "plain-design-composition";

export function useTableOptionFormFilter({hooks, methods}: { hooks: tTableOptionHooks, methods: tTableOptionMethods }) {

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        foArr: [] as iFilterOption[],
        isShow: false,
    })

    const ftoArr = computed(() => state.foArr.map(i => FilterConfig.getTargetOption(i)).filter(Boolean) as iFilterTargetOption[])

    const init = defer()

    hooks.onCollectPlcData.use(plcData => {
        state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList
        state.foArr = getFoArr(state.getSourceFlatPlcList())
        init.resolve()
    })

    hooks.onCollectFilterData.use(async data => {
        await init.promise
        if (state.foArr.length === 0) {return data}
        const queries = ftoArr.value.reduce((prev, fto) => {
            const queries = fto.handler.transform(fto)
            if (!!queries) {
                prev.push(...toArray(queries))
            }
            return prev
        }, [] as iFilterQuery[])
        return !!queries && queries.length > 0 ? [...data, {queries: toArray(queries),}] : data
    })

    function getFoArr(list: tPlc[]): iFilterOption[] {
        return list.map(plc => {
            if (!plc.props.field) {return null}
            const opt: iFilterOption = {
                label: plc.props.title || '',
                field: plc.props.field,
                filterName: plc.props.filterName,
                handlerName: plc.props.filterHandler,
                filterConfig: plc.props.filterConfig,
                value: null,
                plc,
            }
            return opt
        }).filter(Boolean) as iFilterOption[]
    }

    const filterMethods = {
        expand: () => state.isShow = true,
        collapse: () => state.isShow = false,
        toggle: () => state.isShow = !state.isShow,
    }

    const formData = computed(() => state.foArr.reduce((prev, item, index) => {
        prev[index] = item.value
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
                if (state.foArr.length == 0) {return null}
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