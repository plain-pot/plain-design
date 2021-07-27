import {tPlc, tPlcType} from "../../PlTable/plc/utils/plc.type";
import {getPlcKey} from "../../PlTable/plc/utils/usePropsState";

interface iTableOptionCacheFilterData {}

interface iTableOptionCacheSortData {}

interface iTableOptionCacheConfigData {}

export interface iTableOptionCacheItemData {
    id: number,
    title: string,
    time: number,
    data: Record<string, any>,
}

export interface iTableOptionCacheData {
    tableId: string,
    activeId: number | undefined,
    data: iTableOptionCacheItemData[],
}

export interface iTableOptionCacheRegistryConfig<CacheData = any> {
    cacheKey: string,
    applyCache: (plcList: tPlc[], cacheData: CacheData | undefined) => void,
    getCache: () => CacheData,
}

export const getTableId = (flatList: tPlcType[]): string => {
    return flatList.map(getPlcKey).join('_')
}