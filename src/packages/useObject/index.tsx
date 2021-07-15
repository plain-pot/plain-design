import React from "react";
import {tTableOption} from "../createUseTableOption";
import useDialog, {DialogServiceFormatOption} from "../useDialog";
import PlTablePro from "../PlTablePro";
import {defer} from "../../utils/defer";
import {PlainObject} from "../createUseTableOption/createUseTableOption.utils";
import {PlcCheck} from "../PlcCheck";
import PlcPick from "../PlcPick";
import {designPage, onBeforeUnmount, useRefs} from "plain-design-composition";
import {TableNode} from "../PlTable/table/use/useTableNode";

export interface ObjectServiceOption {
    option: tTableOption,
    beforeConfirm?: (data: PlainObject | PlainObject[]) => void | Promise<void>,
    beforeCancel?: () => void | Promise<void>,
}

interface ObjectService {
    (option: ObjectServiceOption): Promise<PlainObject>,

    (option: ObjectServiceOption, multiple: true): Promise<PlainObject[]>,
}

export function useObject() {

    const $dialog = useDialog()
    const {refs, onRef} = useRefs({
        check: null as null | typeof PlcPick.use.class | typeof PlcCheck.use.class
    })

    const $object: ObjectService = (option: ObjectServiceOption, multiple?: true) => {
        const dfd = defer<PlainObject | PlainObject[]>()
        const {option: tableOption, beforeCancel, beforeConfirm} = option

        const onConfirm = async () => {
            if (!refs.check) {
                dfd.reject(new Error('选择失败，内部异常！'))
            } else {
                const data = !multiple ? refs.check.getSelected()! : refs.check.getSelected()!.map((i: TableNode) => i.data)
                !!beforeConfirm && await beforeConfirm(data)
                dfd.resolve(data)
            }
            onRef.check(null)
            dlgOpt.close!()
        }

        const Content = designPage(() => {
            if (!multiple) {onBeforeUnmount(tableOption.hooks.onDblClickCell.use(onConfirm))}

            return () => <>
                <PlTablePro option={tableOption}>
                    {multiple && <PlcCheck toggleOnClickRow ref={onRef.check}/>}
                    {!multiple && <PlcPick toggleOnClickRow ref={onRef.check}/>}
                </PlTablePro>
            </>
        })

        const dlgOpt: Partial<DialogServiceFormatOption> = {
            title: tableOption.config.title,
            status: null,
            render: () => <Content/>,
            dialogProps: {
                closeOnConfirm: false,
                width: '75vw',
                vertical: 'center',
            },
            confirmButton: true,
            cancelButton: true,
            onConfirm,
            onCancel: async () => {
                !!beforeCancel && await beforeCancel()
                onRef.check(null)
                dlgOpt.close!()
            },
        }
        $dialog(dlgOpt)
        return dfd.promise as any
    }

    return {$object}
}

export default useObject
