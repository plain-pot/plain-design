import {tTableOptionHooks} from "../use.hooks";
import {reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import React from "react";
import PlSelect from "../../../PlSelect";
import PlSelectOption from "../../../PlSelectOption";
import {tTableOptionConfig} from "../../createUseTableOption.utils";
import {FilterConfig, iFilterOption, iFilterTargetOption} from "../../../PlFilter/FilterConfig";

export function useTableOptionFilter({config, hooks}: { config: tTableOptionConfig, hooks: tTableOptionHooks }) {

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
        fto: {
            filterBar: null as null | iFilterTargetOption,
        }
    })

    hooks.onRefTable.use(table => {
        state.getSourceFlatPlcList = () => !table.plcData.value ? [] : table.plcData.value.sourceFlatPlcList
        state.fto.filterBar = utils.createFto(config.filter?.filterBar?.field || state.getSourceFlatPlcList!()[0]?.props.field)
    })

    const utils = {
        createFto: (field?: string, defaultValue: any = null): iFilterTargetOption | null => {
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
            }
            return FilterConfig.getTargetOption(option) || null
        }
    }

    const renderFilterBar = () => {

        if (!state.getSourceFlatPlcList || !state.fto.filterBar) {return null}
        const columns = state.getSourceFlatPlcList()

        return (
            <div className="pl-table-pro-filter-bar">
                <PlSelect v-model={state.fto.filterBar.option.field}>
                    {
                        columns.map((plc, index) => !plc.props.field ? null : <PlSelectOption
                            label={plc.props.title || ''}
                            val={plc.props.field}
                            key={index}/>)
                    }
                </PlSelect>
            </div>
        )
    }

    return {
        renderFilterBar,
    }

}