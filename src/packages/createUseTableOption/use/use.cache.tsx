import {tTableOptionConfig} from "../createUseTableOption.utils";
import {tTableOptionHooks} from "./use.hooks";
import {getTableId, iTableOptionCacheData, iTableOptionCacheItemData, iTableOptionCacheRegistryConfig} from "./use.cache.utils";
import {tPlc, tPlcType} from "../../PlTable/plc/utils/plc.type";
import {plainDate} from "../../../utils/plainDate";
import useMessage from "../../useMessage";
import {deepcopy} from "plain-utils/object/deepcopy";
import {defer} from "../../../utils/defer";

export function useTableOptionCache(
    {
        config,
        hooks,
        reload,
    }: {
        config: tTableOptionConfig,
        hooks: tTableOptionHooks,
        reload: () => void,
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

    const init = defer()

    const $message = useMessage()

    const getTimeString = () => plainDate.today('YYYY/MM/DD HH:mm:ss', '').getDisplay()

    const getDataByRegistration = () => {
        return state.registration.reduce((prev, item) => {
            prev[item.cacheKey] = item.getCache()
            return prev
        }, {} as Record<string, any>)
    }

    hooks.onCollectPlcData.use((plcData) => {
        state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList.filter(i => !!i.props.field)
        applyCache(undefined, false)
        init.resolve()
    })

    hooks.onBeginLoad.use(async () => {
        await init.promise
    })

    const tablePropsConfig = (sourceList: tPlcType[]) => {
        state.tableId = getTableId(sourceList)
        state.cacheData = config.getCache(state.tableId) || {tableId: state.tableId, activeId: undefined, data: [],}
    }

    function registry<CacheData = any>(registryConfig: iTableOptionCacheRegistryConfig<CacheData>) {
        state.registration.push(registryConfig)
    }

    function applyCache(activeId: number | undefined, autoReload = true) {
        if (!activeId) {activeId = state.cacheData.activeId}
        const cacheData = activeId == null ? null : state.cacheData.data.find(i => i.id == activeId)
        const sourceFlatPlcList = state.getSourceFlatPlcList!()
        if (!!cacheData) {
            state.registration.forEach(registry => {
                registry.applyCache(sourceFlatPlcList, deepcopy(cacheData.data[registry.cacheKey]))
            })
            state.cacheData.activeId = cacheData.id
        } else {
            state.registration.forEach(registry => {
                registry.applyCache(sourceFlatPlcList, undefined)
            })
            state.cacheData.activeId = undefined
        }
        config.setCache(state.cacheData)

        autoReload && reload()
    }

    function createCache(cacheName: string) {
        const cacheItemData: iTableOptionCacheItemData = {
            id: Date.now(),
            title: cacheName,
            time: getTimeString(),
            data: getDataByRegistration(),
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

    function deleteCache(cacheId: number) {
        if (state.cacheData.activeId === cacheId) {
            return $message.error('不可以删除正在使用的缓存配置！')
        }
        state.cacheData.data = state.cacheData.data.filter(i => i.id !== cacheId)
        config.setCache(state.cacheData)
    }

    function copyCache(cacheId: number, cacheName: string) {
        const cacheItemData = deepcopy(state.cacheData.data.find(i => i.id === cacheId)!)
        const newCacheItemData = {
            ...cacheItemData,
            id: Date.now(),
            title: cacheName,
            time: getTimeString(),
        }
        state.cacheData.activeId = newCacheItemData.id
        state.cacheData.data.unshift(newCacheItemData)
        config.setCache(state.cacheData)
    }

    function overrideCache(cacheId: number) {
        const findIndex = state.cacheData.data.findIndex(i => i.id === cacheId)!
        const cacheItemData = state.cacheData.data[findIndex]
        cacheItemData.data = getDataByRegistration()
        state.cacheData.activeId = cacheItemData.id
        config.setCache(state.cacheData)
    }

    return {
        state,
        tablePropsConfig,
        registry,

        applyCache,
        createCache,
        renameCache,
        deleteCache,
        copyCache,
        overrideCache,
    }
}

export type tTableOptionCache = ReturnType<typeof useTableOptionCache>
