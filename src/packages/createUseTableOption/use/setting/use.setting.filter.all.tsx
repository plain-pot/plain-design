import React from "react";
import {eTableOptionSettingView, iTableOptionSettingInnerUser} from "./use.setting.utils";
import {tTableOptionFilter} from "../use.filter.state";

export function useTableOptionSettingAllFilter({useTableOptionSettingInner, filterState}: { useTableOptionSettingInner: iTableOptionSettingInnerUser, filterState: tTableOptionFilter }) {
    useTableOptionSettingInner({
        key: eTableOptionSettingView.allFilter,
        title: '所有筛选',
        seq: 0.9,
        render: () => (
            <div className="pl-table-pro-setting-all-filter">
                {filterState.state.filters.map((filter, index) => (
                    <div key={index} className="pl-table-pro-setting-all-filter-item">
                        <div>
                            {filter.title}
                        </div>
                        <div>
                            {filter.display()}
                        </div>
                    </div>
                ))}
            </div>
        )
    })
}
