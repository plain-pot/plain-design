import useDialog from "../../useDialog";
import {useRefs} from "plain-design-composition";
import PlForm from "../../PlForm";
import {tPlc} from "../../PlTable/plc/utils/plc.type";
import {TableNode} from "../../PlTable/table/use/useTableNode";
import {tFormPropRules} from "../../PlForm/form.validate";
import PlFormItem from "../../PlFormItem";
import {renderBodyCell} from "../../PlTable/plc/utils/render";
import React from "react";

export function useTableOptionModifyForm() {

    const $dialog = useDialog()
    const {refs, onRef} = useRefs({form: PlForm})

    const modify = ({node, title, plcList, onConfirm, onCancel, rules}: {
        node: TableNode,
        title: string,
        plcList: tPlc[],
        onConfirm: (node: TableNode) => void,
        onCancel?: () => void,
        rules?: tFormPropRules,
    }) => {
        node.edit = true

        const dialog = $dialog({
            status: null,
            dialogProps: {
                wrapperPadding: false,
                horizontal: 'end',
                fullHeight: true,
                transition: 'pl-transition-dialog-right',
                width: null as any,
                destroyOnClose: false,
                closeOnCancel: false,
                closeOnConfirm: false,
                footAlign: 'flex-start',
            },
            title,
            render() {
                return (
                    <div>
                        <PlForm
                            ref={onRef.form}
                            column={1}
                            width={'100%'}
                            centerWhenSingleColumn={false}
                            modelValue={node.editRow}
                            rules={rules}
                        >
                            批量修改
                        </PlForm>
                    </div>
                )
            },
            onConfirm: async () => {
                await refs.form!.validate()
                dialog.close()
                onConfirm(node)
            },
            onCancel: () => {
                dialog.close()
                !!onCancel && onCancel()
            },
            confirmButton: true,
            cancelButton: true,
        })
    }

    return {modify}
}