import {reactive} from "plain-design-composition";
import React from "react";
import {ReactNode} from "react";
import PlInput from "../PlInput";
import {FilterTextContains} from "./editor/FilterTextContains";
import PlSelect from "../PlSelect";
import {tPlc} from "../PlTable/plc/utils/plc.type";
import {tFormRuleItem} from "../PlForm/form.validate";
import PlDate from "../PlDate";
import PlDateRange from "../PlDateRange";

export enum eFilterOperator {
    '=' = '=',
    '~' = '~',
    '>' = '>',
    '>=' = '>=',
    '<' = '<',
    '<=' = '<=',
    'in' = 'in',
    'not in' = 'not in',
    'is null' = 'is null',
    'is not null' = 'is not null',
}

export interface iFilterQuery {
    id?: string | number,
    field: string,
    operator: keyof typeof eFilterOperator | eFilterOperator,
    value?: any,
}

export interface iFilterData {
    queries: iFilterQuery[],
    expression?: string,
}

export interface iRegistryFilterHandler {
    handlerName: string,
    render: (fto: iFilterTargetOption, emitConfirm: () => void) => ReactNode,
    transform: (fto: iFilterTargetOption) => iFilterQuery | iFilterQuery[] | null,
}

export interface iRegistryFilter {
    filterName: string,
    handlers: Record<string, iRegistryFilterHandler>,
    setHandler: (handlerName: string, handler: Omit<iRegistryFilterHandler, 'handlerName'>) => iRegistryFilter,
    getHandler: (handlerName: string) => iRegistryFilterHandler | undefined
}

/**
 * 筛选配置参数对象
 * @author  韦胜健
 * @date    2021/6/17 13:56
 */
export type tFilterConfigObj = {
    defaultValue?: any,                  // 默认的筛选参数
    start?: any,                        // 范围选择绑定的起始字段
    end?: any,                          // 范围选择绑定的截止字段
    flexOrder?: number                  // form-item的flexOrder排序属性
    formColumn?: number,                // formItem的column占用列数属性
    formRule?: tFormRuleItem | tFormRuleItem[],// formItem的rule校验规则
    labelWidth?: number,                // form-item 的label宽度
} & Record<string, any>

/**
 * 筛选配置可以是个对象，也可以是个函数返回对象
 * @author  韦胜健
 * @date    2021/6/17 13:57
 */
export type tFilterConfigGetter = (filter: iFilterOption) => tFilterConfigObj
export type tFilterConfig = tFilterConfigObj | tFilterConfigGetter


export interface iFilterOption {
    label: string,
    field: string,
    value?: any,
    filterName: string,
    handlerName: string,
    filterConfig: tFilterConfig,
    plc?: tPlc,
}

export interface iFilterTargetOption {
    filter: iRegistryFilter,
    handler: iRegistryFilterHandler,
    option: iFilterOption,
    config: tFilterConfigObj,
}

export const FilterConfig = (() => {

    const state = reactive({
        registration: {} as Record<string, iRegistryFilter | undefined>
    })

    const touchFilter = (filterName: string): iRegistryFilter => {
        if (!state.registration[filterName]) {
            state.registration[filterName] = {
                filterName,
                handlers: {},
                getHandler: handlerName => state.registration[filterName]!.handlers[handlerName],
                setHandler(handlerName, handler) {
                    this.handlers[handlerName] = {handlerName, ...handler}
                    return this
                }
            }
        }
        return state.registration[filterName]!
    }

    const getHandler = (filterName: string, handlerName: string): iRegistryFilterHandler | undefined => {
        const filter = touchFilter(filterName)
        if (!filter) {return }
        return filter.getHandler(handlerName)
    }

    const getTargetOption = (opt: iFilterOption): iFilterTargetOption | undefined => {
        const filter = touchFilter(opt.filterName)
        if (!filter) {return }
        const handler = filter.getHandler(opt.handlerName)
        if (!handler) {return }
        return {filter, handler, option: opt, config: typeof opt.filterConfig === "function" ? opt.filterConfig(opt) : opt.filterConfig}
    }

    const formatToQuery = (fto: iFilterTargetOption): iFilterQuery | iFilterQuery[] => {
        const {filterName, handlerName} = fto.option
        return getHandler(filterName, handlerName)!.transform(fto) || []
    }

    return {
        touchFilter,
        getHandler,
        getTargetOption,
        formatToQuery,
    }

})();

FilterConfig.touchFilter('text')
    .setHandler('类似', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => value == null ? null : ({field, value, operator: eFilterOperator["~"]})
    })
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => value == null ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <FilterTextContains v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => value == null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["in"]})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <FilterTextContains v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => value == null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["not in"]})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

FilterConfig.touchFilter('select')
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlSelect v-model={fto.option.value} onChange={emitConfirm}>{fto.config.options()}</PlSelect>,
        transform: ({option: {value, field}}) => value == null ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <PlSelect multiple maxTags={1} collapseTags v-model={fto.option.value} onChange={emitConfirm}>{fto.config.options()}</PlSelect>,
        transform: ({option: {value, field}}) => value == null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["in"]})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <PlSelect multiple maxTags={1} collapseTags v-model={fto.option.value} onChange={emitConfirm}>{fto.config.options()}</PlSelect>,
        transform: ({option: {value, field}}) => value == null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["not in"]})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

FilterConfig.touchFilter('date')
    .setHandler('范围', {
        render: (fto, emitConfirm) => {
            if (!fto.option.value) {fto.option.value = {start: null, end: null}}
            return <PlDateRange v-model-start={fto.option.value.start} v-model-end={fto.option.value.end} onChange={emitConfirm}/>
        },
        transform: ({option: {value, field}}) => {
            if (!value) {return null}
            const {start, end} = value
            const queries: iFilterQuery[] = []
            if (!!start) {queries.push({field, value: start, operator: eFilterOperator[">="]})}
            if (!!end) {queries.push({field, value: end, operator: eFilterOperator["<="]})}
            return queries
        }
    })
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlDate v-model={fto.option.value} onChange={emitConfirm}/>,
        transform: ({option: {value, field}}) => value == null ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <PlDate multiple maxTags={1} collapseTags v-model={fto.option.value} onChange={emitConfirm}/>,
        transform: ({option: {value, field}}) => value == null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["in"]})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <PlDate multiple maxTags={1} collapseTags v-model={fto.option.value} onChange={emitConfirm}/>,
        transform: ({option: {value, field}}) => value == null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["not in"]})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

