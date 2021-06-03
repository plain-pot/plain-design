import useDialog from "../../useDialog";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {cloneTableNode} from "../utils/cloneTableNode";
import React from "react";
import {tPlc} from "../../PlTable/plc/utils/plc.type";
import PlForm from "../../PlForm";
import PlFormItem from "../../PlFormItem";
import {renderBodyCell} from "../../PlTable/plc/utils/render";

export function useTableProEditForm() {
    const $dialog = useDialog()

    const edit = ({node, title, plcList, onConfirm, onCancel}: {
        node: TableNode,
        title: string,
        plcList: tPlc[],
        onConfirm: () => void,
        onCancel: () => void,
    }) => {
        node = cloneTableNode(node)
        node.edit = true
        node.editRow = node.data

        $dialog({
            status: null,
            dialogProps: {
                wrapperPadding: false,
                horizontal: 'end',
                fullHeight: true,
                transition: 'pl-transition-dialog-right',
                width: null as any,
                destroyOnClose: false,
            },
            title,
            render() {
                return (
                    <div>
                        <PlForm column={1} width={'100%'} centerWhenSingleColumn={false}>
                            {plcList.filter(i => !i.props.hideInForm).map((plc, index) => (
                                <PlFormItem key={index} label={plc.props.title}>
                                    {renderBodyCell({node, plc, formEdit: true}).body}
                                </PlFormItem>
                            ))}
                        </PlForm>
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