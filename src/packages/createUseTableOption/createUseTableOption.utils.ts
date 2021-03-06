import {ReactFragment} from "react";
import PlTable from "../PlTable";
import {tFormPropRules} from "../PlForm/form.validate";

/*普通对象类型*/
export type PlainObject = Record<string, any>;

/*默认新建行数据类型*/
export type tDefaultNewRowObject = PlainObject
export type tDefaultNewRowGetter = () => tDefaultNewRowObject | Promise<tDefaultNewRowObject>
export type tDefaultNewRow = tDefaultNewRowObject | tDefaultNewRowGetter

/*请求相关类型*/
export type tRequestConfigMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'
export type tRequestConfig = {
    method: tRequestConfigMethod,
    url: string,
    query?: PlainObject,
    body?: PlainObject,
    headers?: PlainObject,
} & Record<string, any>;

/*tableOptionConfig中url的类型*/
export type tUrlConfig<RequestResp> = {
    base?: string,
    url?: string,
    method?: tRequestConfigMethod,
    query?: PlainObject,
    body?: PlainObject,
    request?: (requestConfig: tRequestConfig) => Promise<RequestResp>;
}

/**
 * tUrlConfig格式化之后得到的对象
 * @author  韦胜健
 * @date    2021/5/19 21:07
 */
export type tUrlConfigFormat<RequestResp> = {
    url: string,
    method: tRequestConfigMethod,
    request: (requestConfig: tRequestConfig) => Promise<RequestResp>;
    query?: PlainObject,
    body?: PlainObject,
} & PlainObject

/**
 * 基础请求路径：
 * url:string = url.base:string
 * - 分页查询会使用这个路径，通过GET方法请求数据；
 * - 新建会根据这个路径，通过POST方法请求；
 * - 更新会根据这个路径，通过PUT方法请求；
 * - 删除会根据这个路径，通过DELETE方法请求；
 *
 * @author  韦胜健
 * @date    2021/4/27 17:03
 */
export type tUrl = string | {
    base?: string,
    query?: string | tUrlConfig<iQueryResponse>,

    insert?: string | tUrlConfig<tInsertResponse>,
    batchInsert?: string | tUrlConfig<tBatchInsertResponse>,

    update?: string | tUrlConfig<tUpdateResponse>,
    batchUpdate?: string | tUrlConfig<tBatchUpdateResponse>,

    delete?: string | tUrlConfig<tDeleteResponse>,
    batchDelete?: string | tUrlConfig<tDeleteResponse>,
}

export interface iQueryResponse {
    rows: any[],
    hasNext: boolean,
    total?: number | null,
}

export type tInsertResponse = { newRow: PlainObject } & Record<string, any>
export type tBatchInsertResponse = { newRows: PlainObject[] } & Record<string, any>
export type tUpdateResponse = tInsertResponse
export type tBatchUpdateResponse = tBatchInsertResponse
export type tDeleteResponse = { error?: string }

/**
 * 按钮配置徐喜怒
 * @author  韦胜健
 * @date    2021/5/19 20:50
 */
export interface iTableButtonConfig {
    label: string,
    show: boolean | (() => boolean),
    disabled: boolean | (() => boolean),
    handler: () => void | Promise<void>,
}

export enum eTableProEditType {
    inline = 'inline',
    form = 'form'
}

/**
 * TablePro默认配置
 * @author  韦胜健
 * @date    2021/5/19 20:51
 */
export interface iTableProDefaultConfig {
    keyField: string,
    bodyRowHeight: number,
    headRowHeight: number,
    indexing?: boolean,
    border?: boolean,
    showRow: number,
    pageSizeOptions: number[],
    editType: keyof typeof eTableProEditType,
    loadOnStart?: boolean,
    copyDefaultExcludeKeys: string[],                                          // 复制一行的时候，不复制的属性
    // injectRules: (filterValues: iFilterValue[], requestConfig: tRequestConfigObject) => void | tRequestConfigObject, // 将筛选条件rules填写到requestConfig中
    getDefaultUrlConfig: {
        query: (data: tUrlConfig<iQueryResponse>) => tUrlConfigFormat<iQueryResponse>,
        insert?: (data: tUrlConfig<tInsertResponse>) => tUrlConfigFormat<tInsertResponse>,
        batchInsert?: (data: tUrlConfig<tBatchInsertResponse>) => tUrlConfigFormat<tBatchInsertResponse>,
        update?: (data: tUrlConfig<tUpdateResponse>) => tUrlConfigFormat<tUpdateResponse>,
        batchUpdate?: (data: tUrlConfig<tBatchUpdateResponse>) => tUrlConfigFormat<tBatchUpdateResponse>,
        delete?: (data: tUrlConfig<tDeleteResponse>) => tUrlConfigFormat<tDeleteResponse>,
        batchDelete?: (data: tUrlConfig<tDeleteResponse>) => tUrlConfigFormat<tDeleteResponse>,
    },
}

/**
 * TablePro配置信息
 * @author  韦胜健
 * @date    2021/5/19 20:51
 */
export interface iTableProConfig<D = any> {
    data?: D[],                                                         // 当前数据
    url?: tUrl,                                                         // 请求地址信息
    pageSize?: number,                                                  // 请求页大小
    editType?: keyof typeof eTableProEditType,                          // 编辑类型
    defaultEditing?: boolean,                                           // <是否默认开启编辑状态>
    defaultNewRow?: tDefaultNewRow,                                     // 新建行的时候的默认新行数据
    copyExcludeKeys?: string[],                                         // 复制一行的时候，额外的不复制的属性
    rules?: tFormPropRules,                                             // 校验规则
    buttons?: iTableButtonConfig[],                                     // 额外的按钮配置
    multipleCheck?: boolean,                                            // 是否显示多选列
    title?: string,                                                     // 标题
    render?: () => ReactFragment,                                       // 自定义内容
    /*enable?: boolean | {
        insert?: boolean | (() => boolean),                             // 是否可新建
        update?: boolean | (() => boolean),                             // 是否可编辑
        delete?: boolean | (() => boolean),                             // 是否可删除
    },
    /!*未来这里可能会有很多属性用来控制很多按钮*!/
    showButton?: {
        insertButton?: boolean,                                         // 默认是否显示新建按钮
        copyButton?: boolean,                                           // 默认是否显示复制按钮
        deleteButton?: boolean,                                         // 默认是否显示删除按钮
    },*/
}

export type tTableOptionConfig = iTableProDefaultConfig & iTableProConfig

export enum TableMode {
    normal = 'normal',
    insert = 'insert',
    update = 'update',
    select = 'select',
}

export interface iTableState {
    list: any[],
    editingWhenAddRow: boolean,
    mode: TableMode,
    selectRows: any[],
    currentKey: string | null,
    tableGetter: () => typeof PlTable.use.class | null,

    isEditing: boolean,
}