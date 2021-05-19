import {tTableOptionConfig, tUrlConfig} from "./createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";
import {tTableHooks} from "./use.hooks";

export function useTableMethods({config, pagination, hooks}: {
    config: tTableOptionConfig,
    pagination: tTablePagination,
    hooks: tTableHooks,
}) {

    const load = async (loadConfig?: { page: number, size: number }) => {
        if (!config.url) {throw new Error('option.config.url 不能为空！')}
        if (!loadConfig) {loadConfig = {page: pagination.pageState.page, size: pagination.pageState.size}}

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
            Object.assign(requestConfig.query, loadConfig)
        } else {
            if (!requestConfig.body) {requestConfig.body = {}}
            Object.assign(requestConfig.body, loadConfig)
        }

        requestConfig = await hooks.onBeforeLoad.exec(requestConfig)
        let list = await request(requestConfig)
        list = await hooks.onAfterLoad.exec(list)
        list = await hooks.onLoaded.exec(list)
        pagination.update({...loadConfig, hasNext: true})
        return list
    }

    const reload = async (reloadConfig?: { size?: number }) => {
        return await load({page: 0, size: (!reloadConfig ? undefined : reloadConfig.size) || pagination.pageState.size})
    }

    const next = async () => {
        const {page, hasNext, size} = pagination.pageState
        if (!hasNext) {return}
        return load({page: page + 1, size})
    }

    const prev = async () => {
        const {page, size} = pagination.pageState
        if (page <= 0) {return}
        return load({page: page - 1, size})
    }

    return {
        load,
        reload,
        next,
        prev,
    }
}

export type tTableMethods = ReturnType<typeof useTableMethods>