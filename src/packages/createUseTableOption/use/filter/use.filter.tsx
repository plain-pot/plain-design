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

export function useTableOptionFilter({config, hooks}: { config: tTableOptionConfig, hooks: tTableOptionHooks }) {

    const filterBar = (() => {
        const state = reactive({
            getSourceFlatPlcList: null as null | (() => tPlc[]),
            fto: null as null | iFilterTargetOption,
        })

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
        })

        const onFieldChange = (field: string) => {
            if (!state.fto) {return}
            state.fto = createFto(field)
        }

        return {
            state,
            render: () => {
                if (!state.getSourceFlatPlcList || !state.fto) {return null}
                const columns = state.getSourceFlatPlcList()
                return (
                    <div className="pl-table-pro-filter-bar">
                        <PlFilter fto={state.fto} key={state.fto.option.filterName + state.fto.option.handlerName}>
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