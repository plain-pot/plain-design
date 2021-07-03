import {iTableProConfig, iTableProDefaultConfig, iTableState, tTableOptionConfig} from "./createUseTableOption.utils";
import {useTableOptionPagination} from "./use/use.paginaiton";
import {useTableOptionMethods} from "./use/use.methods";
import {useTableOptionHooks} from "./use/use.hooks";
import {computed, reactive} from "plain-design-composition";
import {useTableOptionCheck} from "./use/check/use.check";
import {useTableOptionConfirm} from "./use/use.confirm";
import {useTableOptionCommand} from "./use/use.command";
import {useTableOptionButtons} from "./use/use.buttons";
import {useTableOptionSetting} from "./use/setting/use.setting";
import {useTableOptionFilter} from "./use/filter/use.filter";
import {toArray} from "../../utils/toArray";

export function createUseTableOption<D = any>(defaultConfig: iTableProDefaultConfig) {
    return (customConfig: iTableProConfig<D>) => {

        const config: tTableOptionConfig = {
            ...defaultConfig,
            ...customConfig,
        }

        const tableState: iTableState = reactive({
            list: [] as any[],
            editingWhenAddRow: false,
            selectRows: [],
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
        const command = useTableOptionCommand({hooks})
        const confirm = useTableOptionConfirm({hooks})
        const check = useTableOptionCheck({config, hooks, confirm})
        const pagination = useTableOptionPagination({
            tableState,
            config,
            onPrev: () => pageMethods.prev(),
            onNext: () => pageMethods.next(),
            onJump: (page) => pageMethods.jump(page),
            onSizeChange: size => pageMethods.reload({size}),
        })
        const methods = useTableOptionMethods({config, pagination, hooks, tableState, currentNode, check, confirm, getSortData: () => sortData.value})
        const {pageMethods, editMethods} = methods
        const setting = useTableOptionSetting({hooks, methods})
        const buttons = useTableOptionButtons({hooks, methods, command, setting})
        const filter = useTableOptionFilter({hooks, methods})

        const sortData = computed(() => hooks.onCollectSortData.exec(!!config.sort ? [] : []))

        hooks.onLoaded.use(rows => {
            tableState.list = rows
            tableState.currentKey = rows.length > 0 ? rows[0].id : null
        })
        hooks.onRefTable.use(table => tableState.tableGetter = (() => table) as any)
        hooks.onCollectSortData.use(prev => {
            if (!config.sort) {return prev}
            return [...prev, ...toArray(config.sort)]
        })
        hooks.onCollectFilterData.use(async prev => {
            if (!config.filterParam) {return prev}
            const filterParam = typeof config.filterParam === "function" ? await config.filterParam() : config.filterParam
            if (!!filterParam) {
                return [...prev, filterParam]
            }
            return prev
        })

        return {
            tableState,
            config,
            pagination,
            pageMethods,
            editMethods,
            hooks,
            currentNode,
            check,
            buttons,
            filter,
            sortData,
        }
    }
}

export type tTableOption = ReturnType<ReturnType<typeof createUseTableOption>>

export default createUseTableOption