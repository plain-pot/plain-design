import {tTableOptionHooks} from "../use.hooks";
import React from "react";
import {tTableOptionMethods} from "../use.methods";
import {useSearchFilter} from "./useSearchFilter";
import {useFormFilter} from "./useFormFilter";
import {useColumnFilter} from "./useColumnFilter";
import {iTableProConfig} from "../../createUseTableOption.utils";

export function useTableOptionFilter({hooks, methods, customConfig}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, customConfig: iTableProConfig }) {

    const formFilter = useFormFilter({hooks, methods})

    const searchFilter = useSearchFilter({hooks, methods, onCollapse: () => formFilter.toggle(), isCollapse: () => !formFilter.state.isShow})

    const columnFilter = useColumnFilter({hooks, methods, customConfig})

    return {
        searchFilter,
        formFilter,
        columnFilter,
    }

}