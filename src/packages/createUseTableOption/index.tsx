import {iTableProConfig, iTableProDefaultConfig, tTableOptionConfig} from "./createUseTableOption.utils";
import {useTablePagination} from "./use.paginaiton";
import {useTableMethods} from "./use.methods";

export function createUseTableOption<D = any>(defaultConfig: iTableProDefaultConfig) {
    return (customConfig: iTableProConfig<D>) => {

        const config: tTableOptionConfig = {
            ...defaultConfig,
            ...customConfig,
        }

        const pagination = useTablePagination({config})

        const methods = useTableMethods({config, pagination})

        return {
            config,
            pagination,
            methods,
        }
    }
}

export type tTableOption = ReturnType<ReturnType<typeof createUseTableOption>>

export default createUseTableOption