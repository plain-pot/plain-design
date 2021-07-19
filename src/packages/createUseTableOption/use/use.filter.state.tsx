import {computed, reactive} from "plain-design-composition";
import {tTableOptionHooks} from "./use.hooks";
import {tPlc} from "../../PlTable/plc/utils/plc.type";
import {FilterConfig, iFilterOption, iFilterTargetOption, tFilterConfig} from "../../PlFilter/FilterConfig";
import {defer} from "../../../utils/defer";
import {ReactNode} from "react";

/*这四个属性确定一个plc*/
export type tGetPlcKeyConfig = Pick<iFilterOption, 'label' | 'field' | 'filterName' | 'handlerName'>

/*缓存的属性数据*/
export interface iFilterTypeCacheData extends Omit<iFilterOption, 'filterConfig' | 'plc'> {
    id: string,                     // 每一个filter都得有个id，方便做查询表达式
    // value: any,                     /*除了标准的查询的值之外，去重查询的值为string[]，所以得考虑让不同的filter自定义渲染value的方式*/
}

/*缓存的属性数据(map)*/
export interface iFilterTypeCacheMap {[k: string]: { data: iFilterTypeCacheData[] }}

/*渲染的数据*/
export interface iFilterTypeData extends iFilterOption {id: string,}

/*渲染的数据(map)*/
export interface iFilterTypeDataMap {
    [k: string]: {
        data: iFilterTypeData[],
        display: (d: iFilterTypeTargetData) => ReactNode,
    }
}

/*格式化之后的目标渲染数据*/
export interface iFilterTypeTargetData extends Omit<iFilterTargetOption, 'option'> {option: iFilterTypeData}

/*格式化之后的目标渲染数据*/
export interface iFilterTypeTargetDataMap {
    [k: string]: {
        data: iFilterTypeTargetData[],
        display: (d: iFilterTypeTargetData) => ReactNode,
    }
}

export interface iFilterInitializeParam {
    plcKeyString: string,
    filterTypeCache: iFilterTypeCacheMap,
    flatPlcList: tPlc[]
}

export interface iFilterInitialize {
    (param: iFilterInitializeParam): {
        data: iFilterTypeData[],
        display: (d: iFilterTypeTargetData) => ReactNode,
    }
}

export function useTableOptionFilterState({hooks}: { hooks: tTableOptionHooks }) {

    const stateCache = (() => {
        const CACHE_KEY = '@@FILTER_KEY'
        const save = (filterTypeDataMap: iFilterTypeDataMap) => {
            const cacheData = Object.entries(filterTypeDataMap).reduce((prev, [filterKey, state]) => {
                prev[filterKey] = {data: state.data.map(({plc, filterConfig, ...left}) => ({...left}))}
                return prev
            }, {} as iFilterTypeCacheMap)
            window.localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        }
        const restore = (): iFilterTypeCacheMap => {
            const cacheString = window.localStorage.getItem(CACHE_KEY) as null | string
            if (!cacheString) {return {}}
            return JSON.parse(cacheString)
        }
        return {save, restore}
    })();

    const state = reactive({
        filterTypeDataMap: {} as iFilterTypeDataMap,
        getSourceFlatPlcList: null as null | (() => tPlc[]),
    })

    /*找到plc的方法*/
    function getPlcKey(config: tGetPlcKeyConfig): string
    function getPlcKey(plc: tPlc): string
    function getPlcKey(param: tPlc | tGetPlcKeyConfig): string {
        if ('refer' in param) {
            return param.props.field! + (param.props.title || '#_#')
        } else {
            return param.field + param.label || '#_#'
        }
    }

    /*通过 plcKey 找到plc*/
    const plcMap = computed((): Record<string, tPlc> => {
        if (!state.getSourceFlatPlcList) {return {}}
        const plcList = state.getSourceFlatPlcList()
        return plcList.reduce((prev, plc) => (prev[getPlcKey(plc)] = plc, prev), {} as Record<string, tPlc>)
    })

    const init = (() => {
        const dfd = defer<iFilterInitializeParam>()
        hooks.onCollectPlcData.use(plcData => {
            state.getSourceFlatPlcList = () => plcData.sourceFlatPlcList
            const plcKeyString = state.getSourceFlatPlcList().map(getPlcKey).join('.')
            const filterTypeCache = stateCache.restore()
            dfd.resolve({plcKeyString, filterTypeCache, flatPlcList: state.getSourceFlatPlcList()})
        })
        return dfd.promise
    })()


    const ftoMap = computed((): iFilterTypeTargetDataMap => Object.entries(state.filterTypeDataMap).reduce((prev, [filterTypeName, {data, display}]) => {
        prev[filterTypeName] = {
            display,
            data: data.map(fo => FilterConfig.getTargetOption(fo)).filter(Boolean) as iFilterTypeTargetData[]
        }
        return prev
    }, {} as iFilterTypeTargetDataMap))

    function useState(filterKey: string, initialize: iFilterInitialize) {
        init.then((param) => {
            state.filterTypeDataMap[filterKey] = initialize(param)
        })
    }

    return {
        useState,
    }
}

