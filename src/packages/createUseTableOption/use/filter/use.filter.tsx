import {tTableOptionHooks} from "../use.hooks";
import React from "react";
import {tTableOptionMethods} from "../use.methods";
import {useSearchFilter} from "./useSearchFilter";
import {useFormFilter} from "./useFormFilter";

export function useTableOptionFilter({hooks, methods}: { hooks: tTableOptionHooks, methods: tTableOptionMethods, }) {

    const formFilter = useFormFilter({hooks, methods})

    const searchFilter = useSearchFilter({hooks, methods, onCollapse: () => formFilter.toggle(), isCollapse: () => !formFilter.state.isShow})

    return {
        searchFilter,
        formFilter,
    }

}