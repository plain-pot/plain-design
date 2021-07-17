import {iFilterOption, iFilterTargetOption} from "../../../PlFilter/FilterConfig";

export /**
 * 列筛选参数（存储）
 * @author  韦胜健
 * @date    2021/7/17 19:00
 */
interface ColumnFilterData {
    option: iFilterOption,                      // 列中的筛选配置信息
}

/**
 * 列筛选参数（计算，切换handlerName的时候需要重新计算handler）
 * @author  韦胜健
 * @date    2021/7/17 19:01
 */
export interface ColumnFilterTargetData extends ColumnFilterData {
    fto?: iFilterTargetOption,                  // 筛选目标配置信息对象
}