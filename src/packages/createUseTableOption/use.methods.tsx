import {iTableProDefaultConfig, tTableOptionConfig, tUrlConfig} from "./createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";
import {tTableHooks} from "./use.hooks";
import $$notice from "../$$notice";

export function useTableMethods({config, pagination, hooks}: {
    config: tTableOptionConfig,
    pagination: tTablePagination,
    hooks: tTableHooks,
}) {

    const utils = {
        getUrlConfig: (type: keyof iTableProDefaultConfig["getDefaultUrlConfig"]) => {
            if (!config.url) {throw new Error('option.config.url 不能为空！')}
            if (typeof config.url === "string") {
                return {base: config.url}
            } else {
                const base = config.url.base
                const urlConfig = config.url[type]
                return typeof urlConfig === "string" ? {url: urlConfig} : {...urlConfig, base}
            }
        },

    }

    const load = async (loadConfig?: { page?: number, size?: number }) => {
        if (!config.url) {throw new Error('option.config.url 不能为空！')}
        let targetLoadConfig: { page: number, size: number };
        if (!loadConfig) {
            targetLoadConfig = {page: pagination.pageState.page, size: pagination.pageState.size}
        } else {
            targetLoadConfig = {
                page: loadConfig.page != null ? loadConfig.page : pagination.pageState.page,
                size: loadConfig.size != null ? loadConfig.size : pagination.pageState.size,
            }
        }
        const queryUrlConfig: tUrlConfig<any> = utils.getUrlConfig('query')
        let {request, ...requestConfig} = config.getDefaultUrlConfig.query(queryUrlConfig)
        if (requestConfig.method === 'GET') {
            if (!requestConfig.query) {requestConfig.query = {}}
            Object.assign(requestConfig.query, targetLoadConfig)
        } else {
            if (!requestConfig.body) {requestConfig.body = {}}
            Object.assign(requestConfig.body, targetLoadConfig)
        }
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
        const queryUrlConfig: tUrlConfig<any> = utils.getUrlConfig('query')
        let {request, ...requestConfig} = config.getDefaultUrlConfig.query(queryUrlConfig)
        if (requestConfig.method === 'GET') {
            if (!requestConfig.query) {requestConfig.query = {}}
            Object.assign(requestConfig.query, {onlyCount: true})
        } else {
            if (!requestConfig.body) {requestConfig.body = {}}
            Object.assign(requestConfig.body, {onlyCount: true})
        }
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
        insert: () => {},
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