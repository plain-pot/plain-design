import {tTableOptionHooks} from "../use.hooks";
import React from "react";
import {tTableOptionConfig} from "../../createUseTableOption.utils";
import {tTableOptionMethods} from "../use.methods";
import {useSearchFilter} from "./useSearchFilter";

export function useTableOptionFilter({config, hooks, methods}: { config: tTableOptionConfig, hooks: tTableOptionHooks, methods: tTableOptionMethods, }) {

    const searchFilter = useSearchFilter({config, hooks, methods})

    return {
        searchFilter,
    }

}