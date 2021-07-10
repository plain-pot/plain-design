import React from "react";
import {tTableOption} from "../createUseTableOption";
import useDialog, {DialogServiceOption} from "../useDialog";
import PlTablePro from "../PlTablePro";
import {defer} from "../../utils/defer";
import {PlainObject} from "../createUseTableOption/createUseTableOption.utils";
import {PlcCheck} from "../PlcCheck";
import PlcPick from "../PlcPick";

export interface ObjectServiceOption {
    option: tTableOption,
    beforeConfirm?: () => void | Promise<void>,
    beforeCancel?: () => void | Promise<void>,
}

interface ObjectService {
    (option: ObjectServiceOption): Promise<PlainObject>,

    (option: ObjectServiceOption, multiple: true): Promise<PlainObject[]>,
}

export function useObject() {

    const $dialog = useDialog()

    const $object: ObjectService = (option: ObjectServiceOption, multiple?: true) => {
        const dfd = defer<PlainObject | PlainObject[]>()
        const {option: tableOption, beforeCancel, beforeConfirm} = option

        const dlgOpt: DialogServiceOption = {
            title: tableOption.config.title,
            status: null,
            render: () => <>
                <PlTablePro option={tableOption}>
                    {multiple && <PlcCheck toggleOnClickRow/>}
                    {!multiple && <PlcPick toggleOnClickRow/>}
                </PlTablePro>
            </>,
            dialogProps: {
                closeOnConfirm: false,
                width: '75vw',
                vertical: 'center',
            },
            confirmButton: true,
            cancelButton: true,
            onConfirm: () => {
                console.log('confirm')
            },
            onCancel: () => {
                console.log('cancel')
            },
        }

        $dialog(dlgOpt)

        return dfd.promise as any
    }

    return {$object}
}

export default useObject
