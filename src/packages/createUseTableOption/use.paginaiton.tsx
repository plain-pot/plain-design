import {computed, reactive} from "plain-design-composition";
import {tTableOptionConfig} from "./createUseTableOption.utils";
import PlPagination from "../PlPagination";
import React from "react";

export function useTablePagination({state, config}: { state: { list: any[] }, config: tTableOptionConfig }) {

    const pageState = reactive({
        page: 0,
        size: config.pageSize || config.showRow,
        hasNext: false,
    })

    const update = (data: { page: number, size: number, hasNext: boolean }) => {
        pageState.page = data.page
        pageState.size = data.size
        pageState.hasNext = data.hasNext
    }

    const total = computed(() => {
        if (!pageState.hasNext) {
            return pageState.page * pageState.size + state.list.length
        } else {
            return (pageState.page + 1) * pageState.size + 1
        }
    })

    const render = () => {
        return (
            <div className="pl-table-pro-pagination">
                <PlPagination pageSize={pageState.size} currentPage={pageState.page + 1} total={total.value}/>
            </div>
        )
    }

    return {pageState, update, render,}
}

export type tTablePagination = ReturnType<typeof useTablePagination>