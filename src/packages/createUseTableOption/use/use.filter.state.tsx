import {computed, reactive} from "plain-design-composition";
import {tTableOptionHooks} from "./use.hooks";
import {tPlc} from "../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption, iFilterTargetOption, tFilterConfig} from "../../PlFilter/FilterConfig";
import {defer} from "../../../utils/defer";

/*这四个属性确定一个plc*/
export type tGetPlcKeyConfig = Pick<iFilterOption, 'label' | 'field' | 'filterName' | 'handlerName'>

export interface iFilterCacheData extends Omit<iFilterOption, 'filterConfig' | 'plc'> {
    id: string,                     // 每一个filter都得有个id，方便做查询表达式
    filterKey: string,              // 表明属于哪一个filter
    value: any,                     /*除了标准的查询的值之外，去重查询的值为string[]，所以得考虑让不同的filter自定义渲染value的方式*/
}

export interface iFilterStateData extends iFilterCacheData {
    plc: tPlc,
    filterConfig: tFilterConfig,
}

export function useTableOptionFilterState({hooks}: { hooks: tTableOptionHooks }) {

    const CACHE_KEY = '@@FILTER_KEY'


    function getPlc(config: tGetPlcKeyConfig): string
    function getPlc(plc: tPlc): string
    function getPlc(param: tPlc | tGetPlcKeyConfig): string {
        if ('refer' in param) {
            return param.props.field! + (param.props.title || '#_#')
        } else {
            return param.field + param.label || '#_#'
        }
    }

    const stateCache = (() => {
        const save = (foArrMap: Record<string, iFilterStateData[]>) => {
            const cacheData = Object.entries(foArrMap).reduce((prev, [filterKey, foArr]) => {
                prev[filterKey] = foArr.map(({plc, filterConfig, ...left}) => ({...left}))
                return prev
            }, {} as Record<string, iFilterCacheData[]>)
            window.localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        }
        const restore = (): Record<string, iFilterStateData[]> => {
            const cacheString = window.localStorage.getItem(CACHE_KEY) as null | string
            if (!cacheString) {return {}}
            const cacheData: Record<string, iFilterCacheData[]> = JSON.parse(cacheString)
            return Object.entries(cacheData).reduce((prev, [filterKey, cacheData]) => {
                prev[filterKey] = cacheData.map(i => ({
                    ...i,
                    ...(() => {
                        const plc = columnMap.value[getPlc(i)]
                        return {plc, filterConfig: plc.props.filterConfig}
                    })(),
                }))
                return prev
            }, {} as Record<string, iFilterStateData[]>)
        }
        return {save, restore}
    })();

    const state = reactive({
        foArrMap: {} as Record<string, iFilterStateData[]>,
        getSourceFlatPlcList: null as null | (() => tPlc[]),
    })

    /*通过 columnKey 找到plc*/
    const columnMap = computed((): Record<string, tPlc> => {
        if (!state.getSourceFlatPlcList) {return {}}
        const plcList = state.getSourceFlatPlcList()
        return plcList.reduce((prev, plc) => (prev[getPlc(plc)] = plc, prev), {} as Record<string, tPlc>)
    })

    const init = defer()

    hooks.onCollectPlcData.use(plcData => {
        state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList
        state.foArrMap = stateCache.restore()
        init.resolve()
    })

    const ftoArrMap = computed(() => Object.entries(state.foArrMap).reduce((prev, [filterKey, foArr]) => {
        prev[filterKey] = foArr.map(fo => FilterConfig.getTargetOption(fo)).filter(Boolean) as iFilterTargetOption[]
        return prev
    }, {} as Record<string, iFilterTargetOption[]>))

    function useState(filterKey: string, initialize: (cacheData: iFilterStateData[], plcList: tPlc[]) => iFilterStateData[] | void) {
        init.promise.then(() => {
            const cacheData = state.foArrMap[filterKey]
            const initData = initialize(cacheData, state.getSourceFlatPlcList!()) || cacheData
            if (initData !== cacheData) {state.foArrMap[filterKey] = cacheData}
        })
        return {}
    }

    return {
        useState,
    }
}

const filterState = useTableOptionFilterState({} as any)

