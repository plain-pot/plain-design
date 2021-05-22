import {iTableProDefaultConfig, tTableOptionConfig, tUrlConfig} from "./createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";
import {tTableHooks} from "./use.hooks";
import $$notice from "../$$notice";

export function useTableMethods({config, pagination, hooks}: {
    tableState: { editingWhenAddRow: boolean },
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

    const load = async (loadConfig?: { page?: number, size?: number }) => {
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
    }

    const reload = async (reloadConfig?: { size?: number }) => {
        const rows = await load({page: 0, size: !reloadConfig ? undefined : reloadConfig.size})
        pagination.updateTotal(null)
        return rows
    }

    const queryCount = async () => {
        if (!config.url) {throw new Error('option.config.url 不能为空！')}
        let {request, requestData, requestConfig} = utils.getUrlConfig('query')
        Object.assign(requestData, {onlyCount: true})
        requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
        let {total} = await request(requestConfig)
        pagination.updateTotal(total || null)
        return total
    }

    const next = async () => {
        const {page, hasNext} = pagination.pageState
        if (!hasNext) {return}
        return load({page: page + 1})
    }

    const prev = async () => {
        let page = pagination.pageState.page - 1
        if (page < 0) {return}
        return load({page})
    }

    const jump = async (page: number) => {
        if (page < 0) {return}
        if (page > pagination.pageState.page) {
            if (page === pagination.pageState.page + 1 && pagination.pageState.hasNext) {
                return load({page})
            } else {
                const total = await queryCount()
                if (!total) {
                    const msg = '查询总数失败！'
                    $$notice.error(msg)
                    throw new Error(msg)
                }
                const totalPage = Math.ceil(total / pagination.pageState.size) - 1
                if (page > totalPage) {page = totalPage}
                return load({page})
            }
        } else {
            return load({page})
        }
    }

    const editMethods = {
        insert: () => {

        },
        batchInsert: () => {},
    }

    return {
        load,
        reload,
        next,
        prev,
        jump,
    }
}

export type tTableMethods = ReturnType<typeof useTableMethods>