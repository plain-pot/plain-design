import {tTableOptionConfig, tUrlConfig} from "./createUseTableOption.utils";
import {tTablePagination} from "./use.paginaiton";

export function useTableMethods({config, pagination}: { config: tTableOptionConfig, pagination: tTablePagination }) {

    const load = (loadConfig?: { page: number, size: number }) => {
        if (!config.url) {throw new Error('option.config.url 不能为空！')}
        if (!loadConfig) {loadConfig = {page: pagination.state.pageData.page, size: pagination.state.pageData.size}}

        const queryUrlConfig: tUrlConfig<any[]> = (() => {
            if (!config.url) {throw new Error('config.url is required when query list!')}
            if (typeof config.url === "string") {
                return {base: config.url}
            } else {
                const {base, query} = config.url
                return typeof query === "string" ? {url: query} : {...query, base}
            }
        })();

        const {request, ...requestConfig} = config.getDefaultUrlConfig.query(queryUrlConfig)
        if (requestConfig.method === 'GET') {
            if (!requestConfig.query) {requestConfig.query = {}}
            Object.assign(requestConfig.query, loadConfig)
        } else {
            if (!requestConfig.body) {requestConfig.body = {}}
            Object.assign(requestConfig.body, loadConfig)
        }

        const list = request(requestConfig)
    }

    const reload = async (reloadConfig?: { size?: number }) => {
        await load({page: 0, size: (!reloadConfig ? undefined : reloadConfig.size) || pagination.state.pageData.size})
    }

    return {
        load,
        reload,
    }
}