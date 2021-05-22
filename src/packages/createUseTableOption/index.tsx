import {iTableProConfig, iTableProDefaultConfig, iTableState, tTableOptionConfig} from "./createUseTableOption.utils";
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

        const tableState: iTableState = reactive({
            list: [] as any[],
            editingWhenAddRow: false,
            insertRows: [],
            updateRows: [],
            selectRows: [],
        })

        const hooks = useTableHooks({config})

        const pagination = useTablePagination({
            tableState,
            config,
            onPrev: () => pageMethods.prev(),
            onNext: () => pageMethods.next(),
            onJump: (page) => pageMethods.jump(page),
            onSizeChange: size => pageMethods.reload({size}),
        })

        const {pageMethods, editMethods} = useTableMethods({config, pagination, hooks, tableState})

        hooks.onLoaded.use(rows => {
            tableState.list = rows
        })

        return {
            tableState,
            config,
            pagination,
            pageMethods,
            editMethods,
        }
    }
}

export type tTableOption = ReturnType<ReturnType<typeof createUseTableOption>>

export default createUseTableOption