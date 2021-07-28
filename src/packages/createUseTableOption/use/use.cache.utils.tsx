import {tPlc, tPlcType} from "../../PlTable/plc/utils/plc.type";
import {getPlcKey} from "../../PlTable/plc/utils/usePropsState";

interface iTableOptionCacheFilterData {}

interface iTableOptionCacheSortData {}

interface iTableOptionCacheConfigData {}

export interface iTableOptionCacheItemData {
    id: number,
    title: string,
    time: string,
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

export const getTableId = (plcTypeList: tPlcType[]): string => {
    return plcTypeList.map(i => {
        if (i.group) {
            return `${i.props.title || '#'}-${getTableId(i.children)}`
        } else {
            return `${i.props.title || '#'}-${i.props.field || '@'}`
        }
    }).join('_')
}
