import {iTableProConfig, iTableProDefaultConfig, tTableOptionConfig} from "./createUseTableOption.utils";
import {useTablePagination} from "./use.paginaiton";
import {useTableMethods} from "./use.methods";
import {useTableHooks} from "./use.hooks";
import {reactive} from "plain-design-composition";

export function createUseTableOption<D = any>(defaultConfig: iTableProDefaultConfig) {
    return (customConfig: iTableProConfig<D>) => {

        const config: tTableOptionConfig = {
            ...defaultConfig,
            ...customConfig,
        }

        const state = reactive({
            list: [] as any[],
        })

        const hooks = useTableHooks({config})

        const pagination = useTablePagination({state, config})

        const methods = useTableMethods({config, pagination, hooks})

        hooks.onLoaded.use(rows => {
            state.list = rows
        })

        return {
            state,
            config,
            pagination,
            methods,
        }
    }
}

export type tTableOption = ReturnType<ReturnType<typeof createUseTableOption>>

export default createUseTableOption