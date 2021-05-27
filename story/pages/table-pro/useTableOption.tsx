import {$$notice, createUseTableOption} from "../../../src";
import {$http} from "../../http/http";

export const useTableOption = createUseTableOption({
    keyField: 'id',
    bodyRowHeight: 48,
    headRowHeight: 48,
    border: false,
    showRow: 10,
    pageSizeOptions: [5, 10, 20, 50, 100],
    editType: 'inline',
    copyDefaultExcludeKeys: ['id', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt'],
    getDefaultUrlConfig: {
        query: (config) => {
            let {url, base, method, request, ...left} = config
            if (!url && !!base) {url = `${base}/list`}
            if (!method) {method = 'POST'}
            if (!request) {
                request = async (requestConfig) => {
                    try {
                        const {query, body, ...config} = requestConfig
                        const data = await $http({
                            ...config,
                            params: query,
                            data: body,
                        })
                        return {
                            rows: data.list,
                            hasNext: data.hasNext,
                            ...data,
                        }
                    } catch (e) {
                        $$notice.error({title: '查询失败！', message: Object.prototype.toString.call(e)})
                        throw e
                    }
                }
            }
            return {...left, url: url!, method, request,}
        },
        insert: (config) => {
            let {url, base, method, request, ...left} = config
            if (!url && !!base) {url = base}
            if (!method) {method = 'POST'}
            if (!request) {
                request = async (requestConfig) => {
                    try {
                        const {query, body, ...config} = requestConfig
                        const data = await $http({
                            ...config,
                            params: query,
                            data: body,
                        })
                        return {
                            newRow: data.result,
                            ...data,
                        }
                    } catch (e) {
                        $$notice.error({title: '新建失败！', message: String(e)})
                        throw e
                    }
                }
            }
            return {...left, url: url!, method, request,}
        },
        delete: (config) => {
            let {url, base, method, request, ...left} = config
            if (!url && !!base) {url = base}
            if (!method) {method = 'DELETE'}
            if (!request) {
                request = async (requestConfig) => {
                    try {
                        const {query, body, ...config} = requestConfig
                        const data = await $http({
                            ...config,
                            params: query,
                            data: body,
                        })
                        return {error: data.message}
                    } catch (e) {
                        $$notice.error({title: '删除失败！', message: String(e)})
                        throw e
                    }
                }
            }
            return {...left, url: url!, method, request,}
        },
        update: (config) => {
            let {url, base, method, request, ...left} = config
            if (!url && !!base) {url = base}
            if (!method) {method = 'PUT'}
            if (!request) {
                request = async (requestConfig) => {
                    try {
                        const {query, body, ...config} = requestConfig
                        const data = await $http({
                            ...config,
                            params: query,
                            data: body,
                        })
                        return {
                            newRow: data.result,
                            ...data,
                        }
                    } catch (e) {
                        $$notice.error({title: '更新失败！', message: String(e)})
                        throw e
                    }
                }
            }
            return {...left, url: url!, method, request,}
        },
    },
})