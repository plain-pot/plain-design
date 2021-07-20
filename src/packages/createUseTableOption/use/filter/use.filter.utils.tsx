import {iFilterOption} from "../../../PlFilter/FilterConfig";
import {tPlc} from "../../../PlTable/plc/utils/plc.type";

export type iFilterStateDataMap = Record<string, iFilterOption>
export type iFilterCacheData = Omit<iFilterOption, 'filterConfig' | 'plc'>
export type iFilterCacheDataMap = Record<string, iFilterCacheData>

export function createFilterOptionByPlc(plc: tPlc): iFilterOption {
    return {
        label: plc.props.title!,
        field: plc.props.field!,
        handlerName: plc.props.filterHandler,
        filterName: plc.props.filterName,
        value: null,
        plc: plc,
        filterConfig: plc.props.filterConfig,
    }
}
