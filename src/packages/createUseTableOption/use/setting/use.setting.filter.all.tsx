import React, {ReactNode} from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {FilterStateInitialization, tTableOptionFilter} from "../use.filter.state";
import './use.setting.filter.all.scss'
import PlButton from "../../../PlButton";
import {reactive} from "plain-design-composition";
import PlEmpty from "../../../PlEmpty";

export function useTableOptionSettingAllFilter({useTableOptionSettingInner, filterState}: { useTableOptionSettingInner: iTableOptionSettingInnerUser, filterState: tTableOptionFilter }) {

    const state = reactive({
        renderFilters: [] as { filter: FilterStateInitialization, display: () => ReactNode }[],
    })

    const removeAll = () => {
        state.renderFilters = []
        filterState.clearAll()
    }

    const removeFilter = (filter: FilterStateInitialization) => {
        state.renderFilters.splice(state.renderFilters.findIndex(i => i.filter === filter), 1)
        filterState.clearFilter(filter)
    }

    useTableOptionSettingInner({
        key: eTableOptionSettingView.allFilter,
        title: '所有筛选',
        seq: 0.9,
        contentPending: false,
        beforeOpen: () => {
            state.renderFilters = filterState.state.filters.filter(i => i.getActiveFilterCount() > 0).map(filter => ({
                filter,
                display: filter.getDisplay(),
            }))
        },
        render: () => (
            <div className="pl-table-pro-setting-all-filter">
                {state.renderFilters.length === 0 && (
                    <div className="pl-table-pro-setting-all-filter-empty">
                        <PlEmpty label="暂无筛选..."/>
                    </div>
                )}
                {state.renderFilters.length > 0 && (
                    <div>
                        <PlButton label="全部清空" icon="el-icon-delete" status="error" onClick={removeAll}/>
                    </div>
                )}
                {state.renderFilters.map(({filter, display}, index) => {
                    return <div key={index} className="pl-table-pro-setting-all-filter-item">
                        <div className="pl-table-pro-setting-all-filter-item-head">
                            <span>{filter.title}</span>
                            <PlButton icon="el-icon-delete" label="清空" status="error" onClick={() => removeFilter(filter)} mode="text"/>
                        </div>
                        <div className="pl-table-pro-setting-all-filter-item-body">
                            {display()}
                        </div>
                    </div>
                })}
            </div>
        )
    })
}
