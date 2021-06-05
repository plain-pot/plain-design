import {reactive} from "plain-design-composition";
import React from "react";
import {tTableOptionHooks} from "./use.hooks";
import PlButton from "../../PlButton";

export enum eTableProStatus {
    normal = 'normal',
    insert = 'insert',
    batchInsert = 'batchInsert',
    update = 'update',
    batchUpdate = 'batchUpdate',
    select = 'select',
}

interface iHandler {
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string,
}

export function useTableOptionConfirm({hooks}: { hooks: tTableOptionHooks }) {

    const state = reactive({
        status: eTableProStatus.normal,
        innerHandler: null as null | iHandler,
    })

    const close = {
        confirm: async () => {
            if (!!state.innerHandler && !!state.innerHandler.onConfirm) {
                await state.innerHandler.onConfirm()
            }
            state.status = eTableProStatus.normal
            state.innerHandler = null
        },
        cancel: async () => {
            if (!!state.innerHandler && !!state.innerHandler.onCancel) {
                await state.innerHandler.onCancel()
            }
            state.status = eTableProStatus.normal
            state.innerHandler = null
        },
    }

    hooks.onButtons.use((prev) => {
        if (state.status === eTableProStatus.normal) {return prev}
        return <>
            <PlButton label={(state.innerHandler || {}).cancelText || '取消'} icon="el-icon-close-bold" mode="stroke" asyncHandler={close.cancel}/>
            <PlButton label={(state.innerHandler || {}).confirmText || '保存'} icon="el-icon-check-bold" asyncHandler={close.confirm}/>
        </>
    })

    const open = (status: eTableProStatus, handler: iHandler) => {
        state.status = status
        state.innerHandler = handler
    }

    return {
        state,
        open,
        close,
    }
}

export type tTableOptionConfirm = ReturnType<typeof useTableOptionConfirm>