import Axios, {AxiosRequestConfig} from 'axios'
import {env} from "../env";

export type PlainObject = Record<string, any>;

export const $http = (() => {

    const http = Axios.create({
        baseURL: env.base,
    })

    const get = async (url: string, params?: PlainObject, config?: AxiosRequestConfig) => {
        const resp = await http.get(url, {...config, params,})
        return Object.assign(resp.data, {_resp: resp})
    }
    const post = async (url: string, data?: PlainObject, config?: AxiosRequestConfig) => {
        const resp = await http.post(url, data, config)
        return Object.assign(resp.data, {_resp: resp})
    }


})();
