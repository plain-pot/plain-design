import {tTableOptionConfig} from "../createUseTableOption.utils";
import {tTableOptionHooks} from "./use.hooks";
import {iTableOptionCacheData} from "./use.cache.utils";

export function useTableOptionCache(
    {
        config,
        hooks,
    }: {
        config: tTableOptionConfig,
        hooks: tTableOptionHooks,
    }) {

    const state = {
        tableKey: '',
        cacheData: undefined as undefined | iTableOptionCacheData,
    }

    hooks.onCollectPlcData.use((plcData) => {
        const flatPlcList = plcData.sourceFlatPlcList.filter(i => !!i.props.title && !!i.props.field)
        state.tableKey = window.location.hash + flatPlcList.slice(0, 2).map(i => `${i.props.title}:${i.props.field}`).join(',') + flatPlcList.slice(flatPlcList.length - 2).map(i => `${i.props.title}:${i.props.field}`).join(',')

        state.cacheData = config.getCache(state.tableKey)
    })

    return {}
}