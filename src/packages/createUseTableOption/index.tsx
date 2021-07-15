import {iTableProConfig, iTableProDefaultConfig, iTableOptionState, tTableOptionConfig} from "./createUseTableOption.utils";
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
import React from "react";
import {useTableOptionBaseTable} from "./use/use.base-table";
import {useTableOptionPermit} from "./use/use.permit";

export function createUseTableOption<D = any>(defaultConfig: iTableProDefaultConfig) {
    return (customConfig: iTableProConfig<D>) => {

        const config: tTableOptionConfig = {
            ...defaultConfig,
            ...customConfig,
        }

        const tableState: iTableOptionState = reactive({
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
            hooks,
            onPrev: () => pageMethods.prev(),
            onNext: () => pageMethods.next(),
            onJump: (page) => pageMethods.jump(page),
            onSizeChange: size => pageMethods.reload({size}),
        })

        const sortData = computed(() => hooks.onCollectSortData.exec(!!config.sort ? [] : []))

        useTableOptionBaseTable({config, hooks, pagination, tableState, sortData})

        const permit = useTableOptionPermit({config, hooks})

        const methods = useTableOptionMethods({config, pagination, hooks, tableState, currentNode, check, confirm, getSortData: () => sortData.value})

        const {pageMethods, editMethods} = methods

        const setting = useTableOptionSetting({hooks, methods})

        const buttons = useTableOptionButtons({hooks, methods, command, setting, config, permit, confirm})

        const filter = useTableOptionFilter({hooks, methods})

        /*执行初始化逻辑，init一定要放在所有hook之后执行*/
        const init = (() => {
            const state = reactive({
                isInitialized: false,
            })
            Promise.all(hooks.onInit.getListeners().map(i => i(undefined))).finally(() => state.isInitialized = true)
            hooks.onLoading.use((prev) => {
                if (!state.isInitialized) {return true}
                return prev
            })
            return {state}
        })()

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
        hooks.onColumns.use((prev) => {
            return <>
                {prev}
                {!!config.render && config.render()}
            </>
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
            init,
        }
    }
}

export type tUseTableOption = ReturnType<typeof createUseTableOption>

export type tTableOption = ReturnType<tUseTableOption>

export default createUseTableOption
