import React from "react";
import {tTableOption} from "../createUseTableOption";
import useDialog, {DialogServiceFormatOption} from "../useDialog";
import PlTablePro from "../PlTablePro";
import {defer} from "../../utils/defer";
import {PlainObject} from "../createUseTableOption/createUseTableOption.utils";
import {PlcCheck} from "../PlcCheck";
import PlcPick from "../PlcPick";
import {useRefs} from "plain-design-composition";

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


        const dlgOpt: Partial<DialogServiceFormatOption> = {
            title: tableOption.config.title,
            status: null,
            render: () => <>
                <PlTablePro option={tableOption}>
                    {multiple && <PlcCheck toggleOnClickRow ref={onRef.check}/>}
                    {!multiple && <PlcPick toggleOnClickRow ref={onRef.check}/>}
                </PlTablePro>
            </>,
            dialogProps: {
                closeOnConfirm: false,
                width: '75vw',
                vertical: 'center',
            },
            confirmButton: true,
            cancelButton: true,
            onConfirm: async () => {
                if (!refs.check) {
                    dfd.reject(new Error('选择失败，内部异常！'))
                } else {
                    const data = refs.check.getSelected()!
                    !!beforeConfirm && await beforeConfirm(data)
                    dfd.resolve(data)
                }
                onRef.check(null)
                dlgOpt.close!()
            },
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
