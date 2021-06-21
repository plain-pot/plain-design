import {tTableOptionHooks} from "../use.hooks";
import {reactive} from "plain-design-composition";

export function useTableOptionFilter({hooks}: { hooks: tTableOptionHooks }) {

    const state = reactive({
        getColumns: null as null | (() => any)
    })


}