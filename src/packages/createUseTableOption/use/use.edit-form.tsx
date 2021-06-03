import useDialog from "../../useDialog";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {cloneTableNode} from "../utils/cloneTableNode";
import React from "react";

export function useTableProEditForm() {
    const $dialog = useDialog()

    const edit = ({node, title, onConfirm, onCancel}: {
        node: TableNode,
        title: string,
        onConfirm: () => void,
        onCancel: () => void,
    }) => {
        node = cloneTableNode(node)

        $dialog({
            status: null,
            dialogProps: {
                wrapperPadding: false,
                horizontal: 'end',
                fullHeight: true,
                transition: 'pl-transition-dialog-right',
            },
            title,
            render() {
                return (
                    <div>
                        表单编辑
                    </div>
                )
            },
            onConfirm,
            onCancel,
            confirmButton: true,
            cancelButton: true,
        })
    }

    return {
        edit,
    }
}