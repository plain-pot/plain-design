import {reactive} from "plain-design-composition";
import {ReactNode} from "react";

export interface iFilterValue {
    value: any,
    values: any[],
    start: any,
    end: any,
}

export interface iRegistryFilterHandler {
    handlerName: string,
    render: (fv: iFilterValue, emitChange: () => void) => ReactNode,
}

export interface iRegistryFilter {
    filterName: string,
    handlers: Record<string, iRegistryFilterHandler>,
    setHandler: (handlerName: string, handler: Omit<iRegistryFilterHandler, 'handlerName'>) => iRegistryFilter,
    getHandler: (handlerName: string) => iRegistryFilterHandler | undefined
}

export const FilterConfig = (() => {

    const state = reactive({
        registration: {} as Record<string, iRegistryFilter | undefined>
    })

    const touchFilter = (filterName: string) => {
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
        return state.registration[filterName]
    }

    const getHandler = (filterName: string, handlerName: string): iRegistryFilterHandler | undefined => {
        const filter = touchFilter(filterName)
        if (!filter) {return }
        return filter.getHandler(handlerName)
    }

    return {
        touchFilter,
        getHandler,
    }

})();

