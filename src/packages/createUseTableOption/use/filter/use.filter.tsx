import {tTableOptionHooks} from "../use.hooks";
import {reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import React from "react";
import PlSelect from "../../../PlSelect";
import PlSelectOption from "../../../PlSelectOption";
import {tTableOptionConfig} from "../../createUseTableOption.utils";
import {FilterConfig, iFilterOption, iFilterTargetOption} from "../../../PlFilter/FilterConfig";
import PlFilter from "../../../PlFilter";
import PlButton from "../../../PlButton";
import PlTooltip from "../../../PlTooltip";
import {defer} from "../../../../utils/defer";
import {toArray} from "../../../../utils/toArray";
import {tTableOptionMethods} from "../use.methods";

export function useTableOptionFilter({config, hooks, methods}: { config: tTableOptionConfig, hooks: tTableOptionHooks, methods: tTableOptionMethods, }) {

    const filterBar = (() => {

        const state = reactive({
            getSourceFlatPlcList: null as null | (() => tPlc[]),
            fto: null as null | iFilterTargetOption,
        })

        const init = defer()

        function createFto(field?: string, defaultValue: any = null): iFilterTargetOption | null {
            if (!field) {return null}
            const plc = state.getSourceFlatPlcList!().find(plc => plc.props.field === field)
            if (!plc) {return null}
            const option: iFilterOption = {
                label: plc.props.title || '',
                field,
                filterName: plc.props.filterName,
                handlerName: plc.props.filterHandler,
                filterConfig: plc.props.filterConfig,
                value: defaultValue,
                plc,
            }
            return FilterConfig.getTargetOption(option) || null
        }

        hooks.onCollectPlcData.use(plcData => {
            state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList
            state.fto = createFto(config.filter?.filterBar?.field || plcData.sourceFlatPlcList.filter(i => i.props.field)[0]?.props.field)
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

        return {
            state,
            render: () => {
                if (!state.getSourceFlatPlcList || !state.fto) {return null}
                const columns = state.getSourceFlatPlcList()
                return (
                    <div className="pl-table-pro-filter-bar">
                        <PlFilter
                            fto={state.fto}
                            key={state.fto.option.filterName + state.fto.option.handlerName}
                            onHandlerNameChange={onHandlerChange}
                            onConfirm={onConfirm}
                        >
                            {{
                                prepend: () => <PlSelect
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
                                        <PlButton icon="el-icon-arrow-down" style={{borderLeftColor: 'rgba(255,255,255,0.65)'}}/>
                                    </PlTooltip>
                                )
                            }}
                        </PlFilter>
                    </div>
                )
            }
        }
    })()

    return {
        filterBar,
    }

}