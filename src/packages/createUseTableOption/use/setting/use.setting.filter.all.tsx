import React, {ReactNode} from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {FilterStateInitialization, tTableOptionFilter} from "../use.filter.state";
import './use.setting.filter.all.scss'
import PlButton from "../../../PlButton";
import {reactive} from "plain-design-composition";

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
                <div style={{display: 'inline-block', width: '100%'}}>
                    <PlButton label="全部清空" icon="el-icon-delete" status="error" style={{float: 'right'}} onClick={removeAll}/>
                </div>
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