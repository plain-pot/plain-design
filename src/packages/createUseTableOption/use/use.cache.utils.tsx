interface iTableOptionCacheFilterData {}

interface iTableOptionCacheSortData {}

interface iTableOptionCacheConfigData {}

export interface iTableOptionCacheItemData {
    title: string,

    filter: iTableOptionCacheFilterData,
    sort: iTableOptionCacheSortData,
    config: iTableOptionCacheConfigData,
}

export interface iTableOptionCacheData {
    key: string,
    activeTitle: string | undefined,
    data: iTableOptionCacheItemData[],
}