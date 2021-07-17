import {tTableOptionHooks} from "../use.hooks";
import React from "react";
import {tTableOptionMethods} from "../use.methods";
import {useSearchFilter} from "./useSearchFilter";
import {useFormFilter} from "./useFormFilter";
import {useColumnFilter} from "./useColumnFilter";
import {iTableProConfig} from "../../createUseTableOption.utils";

export function useTableOptionFilter({hooks, methods, customConfig}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig }) {

    /**
     * 表单查询
     * @author  韦胜健
     * @date    2021/7/17 18:59
     */
    const formFilter = useFormFilter({hooks, methods})

    /**
     * 搜索栏
     * @author  韦胜健
     * @date    2021/7/17 18:59
     */
    const searchFilter = useSearchFilter({hooks, methods, onCollapse: () => formFilter.toggle(), isCollapse: () => !formFilter.state.isShow})

    /**
     * 列筛选
     * @author  韦胜健
     * @date    2021/7/17 18:59
     */
    const columnFilter = useColumnFilter({hooks, methods, customConfig})

    return {
        searchFilter,
        formFilter,
        columnFilter,
    }

}