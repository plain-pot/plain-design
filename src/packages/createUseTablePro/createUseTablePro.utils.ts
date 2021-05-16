import {ReactFragment} from "react";

export interface iTableProRequest {}

type tDefaultNewRowObject = Record<string, any>
type tDefaultNewRowGetter = () => tDefaultNewRowObject | Promise<tDefaultNewRowObject>
type tDefaultNewRow = tDefaultNewRowObject | tDefaultNewRowGetter

/**
 * filter render渲染的时候，绑定的对象的值
 * @author  韦胜健
 * @date    2021/5/4 15:51
 */
export interface iFilterValue {
    value?: any,                        // 单值查询
    values?: any,                       // 多值查询
    start?: any,                        // 范围查询：起始值
    end?: any,                          // 范围查询：结束值
    field: string,                      // 绑定的子弹
}

/*请求方法*/
export type tRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH' | 'TRACE'

/*请求时，自定义query等请求的配置对象类型*/
export type tUrlConfigObject = { method?: tRequestMethod, url?: string, query?: any, body?: any } & Record<string, any>
export type tUrlConfig = string | tUrlConfigObject
export type tRequestConfigObject = tUrlConfigObject & { url: string, method: tRequestMethod }

/*tableOptionConfig中url的类型*/
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
    query?: tUrlConfig,
    insert?: tUrlConfig,
    update?: tUrlConfig,
    delete?: tUrlConfig,
}

export interface iTableProDefaultConfig {
    keyField: string,
    bodyRowHeight: number,
    headRowHeight: number,
    indexing: boolean,
    border: boolean,
    showRow: number,
    pageSizeOptions: number[],
    editType: 'inline' | 'form',

    loadOnStart?: boolean,
    request: iTableProRequest,
    getDefaultUrlConfig: {},
    defaultNewRow: tDefaultNewRow,
    copyDefaultExcludeKeys: string[],                                          // 复制一行的时候，不复制的属性
    injectRules: (filterValues: iFilterValue[], requestConfig: tRequestConfigObject) => void | tRequestConfigObject, // 将筛选条件rules填写到requestConfig中
}

export interface iTableProConfig<D> {
    data?: D[],                                                         // 当前数据
    url?: tUrl,                                                         // 请求地址信息
    pageSize?: number,                                                  // 页大小选项数组
    defaultEditing?: boolean,                                           // <是否默认开启编辑状态>
    copyExcludeKeys?: string[],                                         // 复制一行的时候，额外的不复制的属性
    // rules?: O2FormRule,                                                 // 校验规则
    // buttons?: iO2TableButtonConfig[],                                   // 额外的按钮配置
    // multipleCheck?: boolean,                                            // 是否显示多选列
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