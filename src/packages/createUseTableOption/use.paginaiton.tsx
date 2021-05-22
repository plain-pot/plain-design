import {computed, reactive} from "plain-design-composition";
import {tTableOptionConfig} from "./createUseTableOption.utils";
import PlPagination from "../PlPagination";
import React from "react";

export function useTablePagination({tableState, config, onPrev, onNext, onJump, onSizeChange}: {
    tableState: { list: any[] },
    config: tTableOptionConfig,

    onPrev: () => void,
    onNext: () => void,
    onJump: (page: number) => void,
    onSizeChange: (size: number) => void,
}) {

    const pageState = reactive({
        page: 0,
        size: config.pageSize || config.showRow,
        hasNext: false,
        total: null as null | number,
    })

    const update = (data: { page: number, size: number, hasNext: boolean, list: any[] }) => {
        pageState.page = data.page
        pageState.size = data.size
        pageState.hasNext = data.hasNext
        if (pageState.hasNext === false) {
            pageState.total = pageState.page * pageState.size + data.list.length
        }
    }

    const updateTotal = (total: null | number) => {
        pageState.total = total
    }

    const total = computed(() => {
        if (pageState.total != null) {
            return pageState.total
        }
        if (!pageState.hasNext) {
            return pageState.page * pageState.size + tableState.list.length
        } else {
            return (pageState.page + 1) * pageState.size + 1
        }
    })

    const render = () => {
        return (
            <div className="pl-table-pro-pagination">
                <PlPagination
                    layout="loading,sizes,pager,prev,next,jumper"
                    size="mini"
                    pageSize={pageState.size}
                    currentPage={pageState.page + 1}
                    total={total.value}
                    limitJumpPageByTotalPage={false}

                    onJump={val => onJump(val - 1)}
                    onCurrentChange={val => onJump(val - 1)}
                    onSizeChange={onSizeChange}
                />
            </div>
        )
    }

    return {pageState, update, render, updateTotal}
}

export type tTablePagination = ReturnType<typeof useTablePagination>