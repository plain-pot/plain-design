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

        const tableState = reactive({
            list: [] as any[],
            editingWhenAddRow: false,
        })

        const hooks = useTableHooks({config})

        const pagination = useTablePagination({
            tableState,
            config,
            onPrev: () => methods.prev(),
            onNext: () => methods.next(),
            onJump: (page) => methods.jump(page),
            onSizeChange: size => methods.reload({size}),
        })

        const methods = useTableMethods({config, pagination, hooks, tableState})

        hooks.onLoaded.use(rows => {
            tableState.list = rows
        })

        return {
            tableState,
            config,
            pagination,
            methods,
        }
    }
}

export type tTableOption = ReturnType<ReturnType<typeof createUseTableOption>>

export default createUseTableOption