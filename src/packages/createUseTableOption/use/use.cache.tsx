import {tTableOptionConfig} from "../createUseTableOption.utils";
import {tTableOptionHooks} from "./use.hooks";
import {getTableId, iTableOptionCacheData, iTableOptionCacheItemData, iTableOptionCacheRegistryConfig} from "./use.cache.utils";
import {tPlc, tPlcType} from "../../PlTable/plc/utils/plc.type";
import {plainDate} from "../../../utils/plainDate";

export function useTableOptionCache(
    {
        config,
        hooks,
    }: {
        config: tTableOptionConfig,
        hooks: tTableOptionHooks,
    }) {

    const state = {
        tableId: '',
        cacheData: ((): iTableOptionCacheData => {
            return {
                tableId: '',
                activeId: undefined,
                data: [],
            }
        })(),
        registration: [] as iTableOptionCacheRegistryConfig[],
        getSourceFlatPlcList: null as null | (() => tPlc[]),
    }

    hooks.onCollectPlcData.use((plcData) => {
        state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList.filter(i => !!i.props.field)
        applyCache()
    })

    const tablePropsConfig = (sourceFlatList: tPlcType[]) => {
        state.tableId = getTableId(sourceFlatList)
        state.cacheData = config.getCache(state.tableId) || {tableId: state.tableId, activeId: undefined, data: [],}
    }

    function registry<CacheData = any>(registryConfig: iTableOptionCacheRegistryConfig<CacheData>) {
        state.registration.push(registryConfig)
    }

    function applyCache(activeId?: number | undefined) {
        if (!activeId) {activeId = state.cacheData.activeId}
        const cacheData = activeId == null ? null : state.cacheData.data.find(i => i.id == activeId)
        const sourceFlatPlcList = state.getSourceFlatPlcList!()
        if (!!cacheData) {
            state.registration.forEach(registry => {
                registry.applyCache(sourceFlatPlcList, cacheData.data[registry.cacheKey])
            })
            state.cacheData.activeId = cacheData.id
        } else {
            state.registration.forEach(registry => {
                registry.applyCache(sourceFlatPlcList, undefined)
            })
            state.cacheData.activeId = undefined
        }
    }

    function createCache(cacheName: string) {
        const cacheItemData: iTableOptionCacheItemData = {
            id: Date.now(),
            title: cacheName,
            time: plainDate.today('YYYY/MM/DD HH:mm:ss', '').getDisplay(),
            data: state.registration.reduce((prev, item) => {
                prev[item.cacheKey] = item.getCache()
                return prev
            }, {} as Record<string, any>),
        }
        state.cacheData.data.unshift(cacheItemData)
        state.cacheData.activeId = cacheItemData.id
        config.setCache(state.cacheData)
    }

    function renameCache(cacheId: number, newCacheName: string) {
        const cacheItemData = state.cacheData.data.find(i => i.id === cacheId)!
        cacheItemData.title = newCacheName
        config.setCache(state.cacheData)
    }

    return {
        state,
        tablePropsConfig,
        registry,
        createCache,
        renameCache,
    }
}

export type tTableOptionCache = ReturnType<typeof useTableOptionCache>