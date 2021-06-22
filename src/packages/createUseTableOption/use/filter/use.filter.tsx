import {tTableOptionHooks} from "../use.hooks";
import {reactive} from "plain-design-composition";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";
import React from "react";

export function useTableOptionFilter({hooks}: { hooks: tTableOptionHooks }) {

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),
    })

    hooks.onRefTable.use(table => {state.getSourceFlatPlcList = () => table.plcData.value!.sourceFlatPlcList})

    const renderFilterBar = () => {
        return (
            <div className="pl-table-pro-filter-bar">
                filter bar
            </div>
        )
    }

    return {
        renderFilterBar,
    }

}