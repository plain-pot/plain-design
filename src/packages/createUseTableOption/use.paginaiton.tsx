import {reactive} from "plain-design-composition";
import {tTableOptionConfig} from "./createUseTableOption.utils";
import PlPagination from "../PlPagination";
import React from "react";

export function useTablePagination({config}: { config: tTableOptionConfig }) {

    const state = reactive({
        pageData: {
            page: 0,
            size: config.pageSize || config.showRow,
            hasNext: false,
        },
    })

    const update = (data: { page: number, size: number, hasNext: boolean }) => {
        state.pageData.page = data.page
        state.pageData.size = data.size
        state.pageData.hasNext = data.hasNext
    }

    const render = () => (
        <PlPagination pageSize={state.pageData.size} currentPage={state.pageData.page}/>
    )

    return {state, update, render,}
}

export type tTablePagination = ReturnType<typeof useTablePagination>