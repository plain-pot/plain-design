import {iAddressConfig, iAddressData, iGetAddressByCodes, iGetAddressByName, iGetAddressByParentCodes, iUseAddressConfig} from "../../src/packages/useAddress/useAddress.utils";
import {useHttp} from "./useHttp";
import {tHttp} from "../../src/packages/useHttp/useHttp.utils";

export const useAddressConfig: iUseAddressConfig = (() => {
    const map = new WeakMap<tHttp, iAddressConfig | undefined>()
    return () => {
        const http = useHttp()
        let config = map.get(http)
        if (!config) {
            const getAddressByCodes: iGetAddressByCodes = async (codes) => {
                const data = await http.post<{ list: iAddressData[] }>('/address/list', {
                    filters: [{field: 'code', value: codes, operator: 'in'}],
                    all: true,
                })
                return data.list.reduce((prev, addr) => (prev[addr.code] = addr, prev), {} as Record<string, iAddressData>)
            }
            const getAddressByParentCodes: iGetAddressByParentCodes = async (parentCodes) => {
                const data = await http.post<{ list: iAddressData[] }>('/address/list', {
                    filters: [{field: 'parentCode', value: parentCodes, operator: 'in'}],
                    all: true,
                })
                return data.list.reduce((prev, addr) => {
                    if (!prev[addr.code]) {
                        prev[addr.code] = []
                    }
                    prev[addr.code].push(addr)
                    return prev
                }, {} as Record<string, iAddressData[]>)
            }
            const getAddressByName: iGetAddressByName = async (name: string, deep) => {
                const data = await http.post<{ list: iAddressData[] }>('/address/list', {
                    filters: [
                        {
                            queries: [
                                {field: 'name', value: name, operator: '~'},
                                ...(deep == null ? [] : [{field: 'deep', value: deep, operator: '='}])
                            ]
                        }],
                    all: true,
                })
                return data.list
            }
            config = {
                getAddressByCodes,
                getAddressByParentCodes,
                getAddressByName,
            }
            map.set(http, config)
        }
        return config!
    }
})()
