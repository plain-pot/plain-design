import {iTableProConfig, iTableProDefaultConfig, iTableState, TableMode, tTableOptionConfig} from "./createUseTableOption.utils";
import {useTablePagination} from "./use/use.paginaiton";
import {useTableMethods} from "./use/use.methods";
import {useTableOptionHooks} from "./use/use.hooks";
import {computed, reactive} from "plain-design-composition";

export function createUseTableOption<D = any>(defaultConfig: iTableProDefaultConfig) {
    return (customConfig: iTableProConfig<D>) => {

        const config: tTableOptionConfig = {
            ...defaultConfig,
            ...customConfig,
        }

        const tableState: iTableState = reactive({
            list: [] as any[],
            editingWhenAddRow: false,
            mode: TableMode.normal,
            selectRows: [],
            isEditing: computed(() => [TableMode.normal, TableMode.select].indexOf(tableState.mode) === -1),
            currentKey: null,
            tableGetter: () => null,
        })

        const currentNode = computed(() => {
            const table = tableState.tableGetter()
            if (!table) {return null}
            if (!tableState.currentKey) {return }
            return table.getNode(tableState.currentKey)
        })

        const hooks = useTableOptionHooks({config})

        const pagination = useTablePagination({
            tableState,
            config,
            onPrev: () => pageMethods.prev(),
            onNext: () => pageMethods.next(),
            onJump: (page) => pageMethods.jump(page),
            onSizeChange: size => pageMethods.reload({size}),
        })

        const {pageMethods, editMethods} = useTableMethods({config, pagination, hooks, tableState, currentNode})

        hooks.onLoaded.use(rows => {
            tableState.list = rows
            tableState.currentKey = rows.length > 0 ? rows[0].id : null
        })
        hooks.onRefTable.use(table => tableState.tableGetter = (() => table) as any)

        return {
            tableState,
            config,
            pagination,
            pageMethods,
            editMethods,
            hooks,
            currentNode,
        }
    }
}

export type tTableOption = ReturnType<ReturnType<typeof createUseTableOption>>

export default createUseTableOption