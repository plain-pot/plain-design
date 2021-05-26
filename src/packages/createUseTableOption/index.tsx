import {TableMode, iTableProConfig, iTableProDefaultConfig, iTableState, tTableOptionConfig} from "./createUseTableOption.utils";
import {useTablePagination} from "./use/use.paginaiton";
import {useTableMethods} from "./use/use.methods";
import {useTableHooks} from "./use/use.hooks";
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
            insertRows: [],
            updateRows: [],
            selectRows: [],
            isEditing: computed(() => [TableMode.normal, TableMode.select].indexOf(tableState.mode) === -1),
            currentKey: null,
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
            tableState.currentKey = rows.length > 0 ? rows[0].id : null
        })

        return {
            tableState,
            config,
            pagination,
            pageMethods,
            editMethods,
            hooks,
        }
    }
}

export type tTableOption = ReturnType<ReturnType<typeof createUseTableOption>>

export default createUseTableOption