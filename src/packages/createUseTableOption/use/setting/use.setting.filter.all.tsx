import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {tTableOptionFilter} from "../use.filter.state";
import './use.setting.filter.all.scss'
import PlButton from "../../../PlButton";

export function useTableOptionSettingAllFilter({useTableOptionSettingInner, filterState}: { useTableOptionSettingInner: iTableOptionSettingInnerUser, filterState: tTableOptionFilter }) {

    useTableOptionSettingInner({
        key: eTableOptionSettingView.allFilter,
        title: '所有筛选',
        seq: 0.9,
        contentPending: false,
        render: () => (
            <div className="pl-table-pro-setting-all-filter">
                <div style={{display: 'inline-block', width: '100%'}}>
                    <PlButton label="全部清空" icon="el-icon-delete" status="error" style={{float: 'right'}} onClick={filterState.clearAll}/>
                </div>

                {filterState.state.filters.map((filter, index) => {

                    const display = filter.display()
                    if (!display) {return null}

                    return <div key={index} className="pl-table-pro-setting-all-filter-item">
                        <div className="pl-table-pro-setting-all-filter-item-head">
                            <span>{filter.title}</span>
                            <PlButton icon="el-icon-delete" label="清空" status="error" onClick={filter.clear} mode="text"/>
                        </div>
                        <div className="pl-table-pro-setting-all-filter-item-body">
                            {filter.display()}
                        </div>
                    </div>
                })}
            </div>
        )
    })
}
