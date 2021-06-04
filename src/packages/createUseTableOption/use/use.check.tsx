import {reactive} from "plain-design-composition";
import {tTableOptionConfig} from "../createUseTableOption.utils";
import {tTableOptionHooks} from "./use.hooks";
import {PlcCheck} from "../../PlcCheck";
import React from "react";
import {eTableProStatus, tTableOptionConfirm} from "./use.confirm";

export function useTableOptionCheck({hooks, config, confirm}: {
    hooks: tTableOptionHooks,
    config: tTableOptionConfig,
    confirm: tTableOptionConfirm,
}) {

    const state = reactive({
        showCheck: false,
    })

    hooks.onColumns.use((content) => {
        if (!state.showCheck) {
            return content
        }
        return <>
            <PlcCheck key="pro-checkbox"/>
            {content}
        </>
    })

    const open = () => {
        state.showCheck = true
    }
    const close = () => {
        state.showCheck = false
    }
    const clear = () => {
        console.log('清空选择')
    }
    const check = () => {console.log('选中某行')}
    const checkAll = () => {console.log('全选当前页')}
    const uncheck = () => {console.log('取消选中某行')}
    const uncheckAll = () => {console.log('取消选中当前页')}
    const reverse = () => {console.log('反选当前页')}
    const toggle = () => {console.log('切换选中状态')}
    const openToCheck = () => {
        open()
        confirm.open(eTableProStatus.select, {
            onConfirm: () => {
                console.log('选择完毕')
                close()
            },
            onCancel: () => {
                console.log('取消选择')
                close()
            },
        })
    }

    return {
        open,
        close,
        clear,
        check,
        checkAll,
        uncheck,
        uncheckAll,
        reverse,
        toggle,
        openToCheck,
    }
}

export type tTableOptionCheck = ReturnType<typeof useTableOptionCheck>