import {reactive} from "plain-design-composition";
import React from "react";
import {ReactNode} from "react";
import PlInput from "../PlInput";
import {FilterTextContains} from "./editor/FilterTextContains";
import PlSelect from "../PlSelect";

export type tFilterConfig = Record<string, any>

export enum eFilterOperator {
    '=' = '=',
    '~' = '~',
    '>' = '>',
    '>=' = '>=',
    '<' = '<',
    '<=' = '<=',
    'is null' = 'is null',
    'is not null' = 'is not null',
    'in' = 'in',
    'not in' = 'not in',
}

export interface iFilterData {
    field: string,
    operator: keyof typeof eFilterOperator | eFilterOperator,
    value?: any,
}

export interface iFilterValue {
    value?: any,
}

export interface iRegistryFilterHandler {
    handlerName: string,
    render: (fto: iFilterTargetOption, emitConfirm: () => void) => ReactNode,
    transform: (fto: iFilterTargetOption) => iFilterData | iFilterData[] | null,
}

export interface iRegistryFilter {
    filterName: string,
    handlers: Record<string, iRegistryFilterHandler>,
    setHandler: (handlerName: string, handler: Omit<iRegistryFilterHandler, 'handlerName'>) => iRegistryFilter,
    getHandler: (handlerName: string) => iRegistryFilterHandler | undefined
}

export interface iFilterOption {
    field: string,
    value?: any,
    filterName: string,
    handlerName: string,
    filterConfig: tFilterConfig,
}

export interface iFilterTargetOption {
    filter: iRegistryFilter,
    handler: iRegistryFilterHandler,
    option: iFilterOption,
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
        return {filter, handler, option: opt}
    }

    return {
        touchFilter,
        getHandler,
        getTargetOption,
    }

})();

FilterConfig.touchFilter('text')
    .setHandler('类似', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => value != null ? null : ({field, value, operator: eFilterOperator["~"]})
    })
    .setHandler('等于', {
        render: (fto, emitConfirm) => <PlInput v-model={fto.option.value} onEnter={emitConfirm}/>,
        transform: ({option: {value, field}}) => value != null ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto) => <FilterTextContains v-model={fto.option.value}/>,
        transform: ({option: {value, field}}) => value != null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["in"]})
    })
    .setHandler('不包含', {
        render: (fto) => <FilterTextContains v-model={fto.option.value}/>,
        transform: ({option: {value, field}}) => value != null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["not in"]})
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
        render: (fto, emitConfirm) => <PlSelect v-model={fto.option.value} onChange={emitConfirm}>{fto.option.filterConfig.options()}</PlSelect>,
        transform: ({option: {value, field}}) => value != null ? null : ({field, value, operator: eFilterOperator["="]})
    })
    .setHandler('包含', {
        render: (fto, emitConfirm) => <PlSelect multiple v-model={fto.option.value} onChange={emitConfirm}>{fto.option.filterConfig.options()}</PlSelect>,
        transform: ({option: {value, field}}) => value != null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["in"]})
    })
    .setHandler('不包含', {
        render: (fto, emitConfirm) => <PlSelect multiple v-model={fto.option.value} onChange={emitConfirm}>{fto.option.filterConfig.options()}</PlSelect>,
        transform: ({option: {value, field}}) => value != null || value.length === 0 ? null : ({field, value, operator: eFilterOperator["not in"]})
    })
    .setHandler('为空值', {
        render: () => <PlInput placeholder="为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: () => <PlInput placeholder="不为空" disabled/>,
        transform: ({option: {field}}) => ({field, operator: eFilterOperator["is not null"]})
    })

