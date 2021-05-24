import {iTableProDefaultConfig, iTableState, TableMode, tTableOptionConfig, tUrlConfig} from "../createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";
import {tTableHooks} from "./use.hooks";
import $$notice from "../../$$notice";
import {nextTick} from "../../../utils/nextTick";
import {useTableAsyncMethods} from "../utils/useTableMethods";

export function useTableMethods({tableState, config, pagination, hooks}: {
    tableState: iTableState,
    config: tTableOptionConfig,
    pagination: tTablePagination,
    hooks: tTableHooks,
}) {

    const utils = {
        getUrlConfig: <T extends keyof iTableProDefaultConfig["getDefaultUrlConfig"]>(type: T) => {
            const urlConfig: tUrlConfig<any> = (() => {
                if (!config.url) {throw new Error('option.config.url 不能为空！')}
                if (typeof config.url === "string") {
                    return {base: config.url}
                } else {
                    const base = config.url.base
                    const urlConfig = config.url[type]
                    return typeof urlConfig === "string" ? {url: urlConfig} : {...urlConfig as any, base}
                }
            })();
            let {request, ...requestConfig} = config.getDefaultUrlConfig[type]!(urlConfig)
            const requestData: any = (() => {
                const dataName = requestConfig.method === 'GET' ? 'query' : 'body'
                if (!requestConfig[dataName]) {requestConfig[dataName] = {}}
                return requestConfig[dataName]
            })();
            return {
                /*用来发送请求的request函数*/
                request: request as any as iTableProDefaultConfig["getDefaultUrlConfig"][T],
                /*请求参数，如果是GET请求，则为config.query，否则为config.body*/
                requestData,
                /*请求配置对象*/
                requestConfig,
            }
        },
    }

    const pageMethods = {
        load: async (loadConfig?: { page?: number, size?: number }) => {
            if (!config.url) {throw new Error('option.config.url 不能为空！')}
            let targetLoadConfig = {
                page: !!loadConfig && loadConfig.page != null ? loadConfig.page : pagination.pageState.page,
                size: !!loadConfig && loadConfig.size != null ? loadConfig.size : pagination.pageState.size,
            }
            let {request, requestData, requestConfig} = utils.getUrlConfig('query')
            Object.assign(requestData, targetLoadConfig)
            requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
            let {rows, hasNext} = await request(requestConfig)
            rows = await hooks.onAfterLoad.exec(rows)
            rows = await hooks.onLoaded.exec(rows)
            pagination.update({...targetLoadConfig, hasNext, list: rows})
            return rows
        },
        reload: async (reloadConfig?: { size?: number }) => {
            const rows = await pageMethods.load({page: 0, size: !reloadConfig ? undefined : reloadConfig.size})
            pagination.updateTotal(null)
            return rows
        },
        queryCount: async () => {
            if (!config.url) {throw new Error('option.config.url 不能为空！')}
            let {request, requestData, requestConfig} = utils.getUrlConfig('query')
            Object.assign(requestData, {onlyCount: true})
            requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
            let {total} = await request(requestConfig)
            pagination.updateTotal(total || null)
            return total
        },
        next: async () => {
            const {page, hasNext} = pagination.pageState
            if (!hasNext) {return}
            return pageMethods.load({page: page + 1})
        },
        prev: async () => {
            let page = pagination.pageState.page - 1
            if (page < 0) {return}
            return pageMethods.load({page})
        },
        jump: async (page: number) => {
            if (page < 0) {return}
            if (page > pagination.pageState.page) {
                if (page === pagination.pageState.page + 1 && pagination.pageState.hasNext) {
                    return pageMethods.load({page})
                } else {
                    const total = await pageMethods.queryCount()
                    if (!total) {
                        const msg = '查询总数失败！'
                        $$notice.error(msg)
                        throw new Error(msg)
                    }
                    const totalPage = Math.ceil(total / pagination.pageState.size) - 1
                    if (page > totalPage) {page = totalPage}
                    return pageMethods.load({page})
                }
            } else {
                return pageMethods.load({page})
            }
        },
    }

    const editUtils = {
        saveInsert: async () => {

        },
    }

    const editMethods = useTableAsyncMethods({
        insert: async () => {
            tableState.editingWhenAddRow = true
            tableState.mode = TableMode.insert
            const newRowData = {}
            tableState.list.unshift(newRowData)
            tableState.insertRows = [tableState.list[0]]
            await nextTick()
            tableState.editingWhenAddRow = false

            return {
                onSave: () => {
                    if (tableState.mode !== TableMode.insert) {return}

                },
                onCancel: () => {
                    if (tableState.mode !== TableMode.insert) {return}

                    tableState.list.shift()
                    tableState.insertRows = []
                    tableState.mode = TableMode.normal
                },
            }
        },
    })

    return {
        editMethods,
        pageMethods,
    }
}

export type tTableMethods = ReturnType<typeof useTableMethods>