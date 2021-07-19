import {reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import {defer} from "../../../../utils/defer";
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

export function useTableOptionSearchFilter({hooks, methods, filterState, onCollapse, isCollapse}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, filterState: tTableOptionFilter, onCollapse: () => void, isCollapse: () => boolean }) {
    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        fto: null as null | iFilterTargetOption,
    })

    const init = defer()

    function createFto(field?: string): iFilterTargetOption | null {
        if (!field) {return null}
        const plc = state.getSourceFlatPlcList!().find(plc => plc.props.field === field)
        if (!plc) {return null}
        const option: iFilterOption = {
            label: plc.props.title || '',
            field,
            filterName: plc.props.filterName,
            handlerName: plc.props.filterHandler,
            filterConfig: plc.props.filterConfig,
            value: null,
            plc,
        }
        return FilterConfig.getTargetOption(option) || null
    }

    hooks.onCollectPlcData.use(plcData => {
        state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList
        state.fto = createFto(plcData.sourceFlatPlcList.filter(i => i.props.field)[0]?.props.field)
        init.resolve()
    })

    const onFieldChange = (field: string) => {!!state.fto && (state.fto = createFto(field))}
    const onHandlerChange = () => {state.fto = FilterConfig.getTargetOption(state.fto!.option) as any}
    const onConfirm = () => methods.pageMethods.reload()

    hooks.onCollectFilterData.use(async data => {
        await init.promise
        if (!state.fto) {return data}
        const queries = state.fto.handler.transform(state.fto)
        return !!queries ? [...data, {queries: toArray(queries),}] : data
    })

    const render = () => {
        if (!state.getSourceFlatPlcList || !state.fto) {return null}
        const columns = state.getSourceFlatPlcList()
        return (
            <div className="pl-table-pro-filter-bar" style={{width: '600px'}}>
                <PlFilter
                    fto={state.fto}
                    key={state.fto.option.filterName + state.fto.option.handlerName}
                    onHandlerNameChange={onHandlerChange}
                    onConfirm={onConfirm}
                    block
                >
                    {{
                        prepend: () => <PlSelect
                            className="pl-filter-ele"
                            inputProps={{width: '120px'}}
                            v-model={state.fto!.option.field}
                            onChange={onFieldChange as any}>
                            {
                                columns.map((plc, index) => !plc.props.field ? null : <PlSelectOption
                                    label={plc.props.title || ''}
                                    val={plc.props.field}
                                    key={index}/>)
                            }
                        </PlSelect>,
                        append: () => (
                            <PlTooltip title="展开/折叠 · 表单查询">
                                <PlButton className="pl-filter-ele" icon={`el-icon-arrow-${isCollapse() ? 'down' : 'up'}`} style={{borderLeftColor: 'rgba(255,255,255,0.65)'}} onClick={onCollapse}/>
                            </PlTooltip>
                        )
                    }}
                </PlFilter>
            </div>
        )
    }

    return {
        state,
        render,
    }
}
