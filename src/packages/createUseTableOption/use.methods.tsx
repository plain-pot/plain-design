import {tTableOptionConfig, tUrlConfig} from "./createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";
import {tTableHooks} from "./use.hooks";

export function useTableMethods({config, pagination, hooks}: {
    config: tTableOptionConfig,
    pagination: tTablePagination,
    hooks: tTableHooks,
}) {

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

        const queryUrlConfig: tUrlConfig<any[]> = (() => {
            if (!config.url) {throw new Error('config.url is required when query list!')}
            if (typeof config.url === "string") {
                return {base: config.url}
            } else {
                const {base, query} = config.url
                return typeof query === "string" ? {url: query} : {...query, base}
            }
        })();

        let {request, ...requestConfig} = config.getDefaultUrlConfig.query(queryUrlConfig)
        if (requestConfig.method === 'GET') {
            if (!requestConfig.query) {requestConfig.query = {}}
            Object.assign(requestConfig.query, targetLoadConfig)
        } else {
            if (!requestConfig.body) {requestConfig.body = {}}
            Object.assign(requestConfig.body, targetLoadConfig)
        }
        requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
        let list = await request(requestConfig)
        list = await hooks.onAfterLoad.exec(list)
        list = await hooks.onLoaded.exec(list)
        pagination.update({...targetLoadConfig, hasNext: true})
        return list
    }

    const reload = async (reloadConfig?: { size?: number }) => {
        return await load({page: 0, size: !reloadConfig ? undefined : reloadConfig.size})
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
        console.log('jump', page)
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