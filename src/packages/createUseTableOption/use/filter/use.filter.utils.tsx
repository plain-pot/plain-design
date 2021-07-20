import {iFilterOption} from "../../../PlFilter/FilterConfig";

export type iFilterStateDataMap = Record<string, iFilterOption>
export type iFilterCacheData = Omit<iFilterOption, 'filterConfig' | 'plc'>
export type iFilterCacheDataMap = Record<string, iFilterCacheData>
