import {reactive} from "plain-design-composition";
import React from "react";
import {ReactNode} from "react";
import PlInput from "../PlInput";
import {FilterTextContains} from "./editor/FilterTextContains";

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
    filterName: string,
    handlerName: string,
    filterValue: iFilterValue,
    filterConfig?: tFilterConfig,
}

export interface iFilterTargetOption extends iFilterOption {
    filter: iRegistryFilter,
    handler: iRegistryFilterHandler,
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
        return {...opt, filter, handler,}
    }

    return {
        touchFilter,
        getHandler,
        getTargetOption,
    }

})();

FilterConfig.touchFilter('text')
    .setHandler('类似', {
        render: ({filterValue}, emitConfirm) => <PlInput v-model={filterValue.value} onEnter={emitConfirm}/>,
        transform: ({filterValue, field}) => !filterValue.value ? null : ({field, value: filterValue.value, operator: eFilterOperator["="]})
    })
    .setHandler('等于', {
        render: ({filterValue}, emitConfirm) => <PlInput v-model={filterValue.value} onEnter={emitConfirm}/>,
        transform: ({filterValue, field}) => !filterValue.value ? null : ({field, value: filterValue.value, operator: eFilterOperator["~"]})
    })
    .setHandler('包含', {
        render: ({filterValue}) => <FilterTextContains v-model={filterValue.value}/>,
        transform: ({filterValue, field}) => !filterValue.value || filterValue.value.length === 0 ? null : ({field, value: filterValue.value, operator: eFilterOperator["in"]})
    })
    .setHandler('不包含', {
        render: ({filterValue}) => <FilterTextContains v-model={filterValue.value}/>,
        transform: ({filterValue, field}) => !filterValue.value || filterValue.value.length === 0 ? null : ({field, value: filterValue.value, operator: eFilterOperator["not in"]})
    })
    .setHandler('为空值', {
        render: (fv) => <PlInput placeholder="为空" disabled/>,
        transform: ({field}) => ({field, operator: eFilterOperator["is null"]})
    })
    .setHandler('不为空值', {
        render: (fv) => <PlInput placeholder="不为空" disabled/>,
        transform: ({field}) => ({field, operator: eFilterOperator["is not null"]})
    })

