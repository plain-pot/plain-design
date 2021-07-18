import {tTableOptionHooks} from "../use.hooks";
import React from "react";
import {tTableOptionMethods} from "../use.methods";
import {useTableOptionSearchFilter} from "./useSearchFilter";
import {useTableOptionFormFilter} from "./useFormFilter";
import {useTableOptionColumnFilter} from "./useColumnFilter";
import {iTableProConfig} from "../../createUseTableOption.utils";
import {tTableOptionSort} from "../use.sort.state";

export function useTableOptionFilter({hooks, methods, customConfig, sortState}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig, sortState: tTableOptionSort }) {

    /**
     * 表单查询
     * @author  韦胜健
     * @date    2021/7/17 18:59
     */
    const formFilter = useTableOptionFormFilter({hooks, methods})

    /**
     * 搜索栏
     * @author  韦胜健
     * @date    2021/7/17 18:59
     */
    const searchFilter = useTableOptionSearchFilter({hooks, methods, onCollapse: () => formFilter.toggle(), isCollapse: () => !formFilter.state.isShow})

    /**
     * 列筛选
     * @author  韦胜健
     * @date    2021/7/17 18:59
     */
    const columnFilter = useTableOptionColumnFilter({hooks, methods, customConfig, sortState})

    return {
        searchFilter,
        formFilter,
        columnFilter,
    }

}