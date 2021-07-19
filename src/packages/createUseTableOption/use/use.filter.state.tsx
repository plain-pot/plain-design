import {tTableOptionHooks} from "./use.hooks";
import {tPlc} from "../../PlTable/plc/utils/plc.type";
import {ReactNode} from "react";
import {computed, reactive} from "plain-design-composition";

export interface FilterStateInitialization<State = any, Cache = any> {
    key: string,                                                                    // 每个筛选类型自己的唯一标识
    state: State,                                                                   // 每个筛选自己的状态数据
    onReady: (flatPlcList: tPlc[], cacheData: Cache) => void,                       // 此时已经得到了列以及缓存数据
    getActiveFilterCount: () => number,                                             // 显示当前有多少激活的筛选条件
    display: () => ReactNode,                                                       // 在【所有筛选】面板中展示
    clear: () => void,                                                              // 清空筛选条件
    getCacheData: () => Cache,                                                      // 获取要缓存的数据
}

const CacheUtils = (() => {

    const CACHE_KEY = '@@TABLE_CACHE_KEY'

    const cacheData = (() => {
        const cacheString = window.localStorage.getItem(CACHE_KEY)
        if (!cacheString) {
            return {}
        } else {
            return JSON.parse(cacheString) as Record<string, any>
        }
    })()

    const save = (tableKey: string, filters: FilterStateInitialization[]) => {
        cacheData[tableKey] = filters.reduce((prev, item) => (prev[item.key] = item.getCacheData(), prev), {} as Record<string, any>)
        window.localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    }

    const restore = (tableKey: string) => {
        return cacheData[tableKey]
    }

    return {save, restore}
})();

function getPlcKey(plc: tPlc) {
    return plc.props.field! + (plc.props.title || '#_#')
}

export function useTableOptionFilterState({hooks}: { hooks: tTableOptionHooks }) {

    const state = reactive({
        getSourceFlatPlcList: null as null | (() => tPlc[]),                        // 原始列信息对象
        plcKeyString: '',                                                           // 表格的唯一标识
        filters: [] as FilterStateInitialization[],                                 // 已经注册的筛选类型
    })

    hooks.onCollectPlcData.use(val => {
        const flatPlcList = val.sourceFlatPlcList.filter(i => !!i.props.field)
        const plcKeyString = flatPlcList.map(getPlcKey).join('.')
        const cacheData = CacheUtils.restore(plcKeyString)

        state.getSourceFlatPlcList = () => flatPlcList
        state.plcKeyString = plcKeyString

        state.filters.forEach(filter => {
            filter.onReady(flatPlcList, !cacheData ? undefined : cacheData[filter.key])
        })
    })

    function useState<State, Cache>(initialization: FilterStateInitialization<State, Cache>): FilterStateInitialization<State, Cache> {
        const data = reactive(initialization)
        state.filters.push(data)
        return data as any
    }

    function save() {
        CacheUtils.save(state.plcKeyString, state.filters)
    }

    const activeFilterCount = computed(() => state.filters.reduce((prev, i) => prev + i.getActiveFilterCount(), 0))

    return {
        useState,
        save,
        activeFilterCount,
    }
}

export type tTableOptionFilter = ReturnType<typeof useTableOptionFilterState>