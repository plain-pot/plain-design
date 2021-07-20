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
import {iFilterData} from "../PlFilter/FilterConfig";
import {useTableOptionSortState} from "./use/use.sort.state";
import {useTableOptionFilterState} from "./use/use.filter.state";

export function createUseTableOption<D = any>(defaultConfig: iTableProDefaultConfig) {
    return (customConfig: iTableProConfig<D>) => {

        const config: tTableOptionConfig = {
            ...defaultConfig,
            ...customConfig,
        }

        /*内部状态*/
        const tableState: iTableOptionState = reactive({
            list: [] as any[],
            editingWhenAddRow: false,
            selectRows: [],
            currentKey: null,
            tableGetter: () => null,
        })

        /*当前高亮节点*/
        const currentNode = computed(() => {
            const table = tableState.tableGetter()
            if (!table) {return null}
            if (!tableState.currentKey) {return }
            return table.getNode(tableState.currentKey)
        })

        /*钩子函数*/
        const hooks = useTableOptionHooks({config})

        /*指令（键盘快捷键）*/
        const command = useTableOptionCommand({hooks})

        /*确认动作*/
        const confirm = useTableOptionConfirm({hooks})

        /*多选*/
        const check = useTableOptionCheck({config, hooks, confirm})

        /*分页*/
        const pagination = useTableOptionPagination({
            tableState,
            config,
            hooks,
            onPrev: () => pageMethods.prev(),
            onNext: () => pageMethods.next(),
            onJump: (page) => pageMethods.jump(page),
            onSizeChange: size => pageMethods.reload({size}),
        })

        /*排序的数据*/
        const sortData = computed(() => hooks.onCollectSortData.exec(!!config.sort ? [] : []))

        /*权限控制*/
        const permit = useTableOptionPermit({config, hooks})

        /*方法*/
        const methods = useTableOptionMethods({config, pagination, hooks, tableState, currentNode, check, confirm, getSortData: () => sortData.value})

        /*结构的方法*/
        const {pageMethods, editMethods} = methods

        /*排序数据管理*/
        const sortState = useTableOptionSortState({methods, hooks})

        const filterState = useTableOptionFilterState({hooks, methods})

        /*设置弹框*/
        const setting = useTableOptionSetting({hooks, methods, sortState, filterState})

        /*按钮*/
        const buttons = useTableOptionButtons({hooks, methods, command, setting, config, permit, confirm})

        /*筛选查询*/
        const filter = useTableOptionFilter({hooks, methods, customConfig, sortState, filterState, setting})

        /*基础表格渲染*/
        useTableOptionBaseTable({config, hooks, pagination, tableState, sortState})

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

        /*查询完毕之后更新列表数据*/
        hooks.onLoaded.use(rows => {
            tableState.list = rows
            tableState.currentKey = rows.length > 0 ? rows[0].id : null
        })
        /*获取base table的引用*/
        hooks.onRefTable.use(table => tableState.tableGetter = (() => table) as any)
        /*config.sort作为默认的排序参数*/
        hooks.onCollectSortData.use(prev => {
            if (!config.sort) {return prev}
            return [...prev, ...toArray(config.sort)]
        })
        /*收集筛选参数*/
        hooks.onCollectFilterData.use(async prev => {
            if (!config.filterParam) {return prev}
            const filterParam = toArray(typeof config.filterParam === "function" ? await config.filterParam() : config.filterParam).filter(Boolean) as iFilterData[]
            if (!!filterParam) {
                return [...prev, ...filterParam]
            }
            return prev
        })
        /*收集config.render中的列信息*/
        hooks.onColumns.use((prev) => {
            return <>
                {prev}
                {!!config.render && config.render()}
            </>
        })

        return {
            customConfig,
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
