import {tTableOptionConfig} from "../createUseTableOption.utils";
import {tTableOptionHooks} from "./use.hooks";
import {getTableId, iTableOptionCacheData, iTableOptionCacheRegistryConfig} from "./use.cache.utils";
import {tPlc, tPlcType} from "../../PlTable/plc/utils/plc.type";

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
        cacheData: undefined as undefined | iTableOptionCacheData,
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
        if (!activeId) {activeId = state.cacheData!.activeId}
        const cacheData = activeId == null ? null : state.cacheData!.data.find(i => i.id == activeId)
        const sourceFlatPlcList = state.getSourceFlatPlcList!()
        if (!!cacheData) {
            state.registration.forEach(registry => {
                registry.applyCache(sourceFlatPlcList, cacheData.data[registry.cacheKey])
            })
            state.cacheData!.activeId = cacheData.id
        } else {
            state.registration.forEach(registry => {
                registry.applyCache(sourceFlatPlcList, undefined)
            })
            state.cacheData!.activeId = undefined
        }
    }

    return {
        tablePropsConfig,
        registry,
    }
}

export type tTableOptionCache = ReturnType<typeof useTableOptionCache>