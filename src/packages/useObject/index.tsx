import React from "react";
import {tTableOption} from "../createUseTableOption";
import useDialog, {DialogServiceOption} from "../useDialog";
import PlTablePro from "../PlTablePro";
import {defer} from "../../utils/defer";
import {PlainObject} from "../createUseTableOption/createUseTableOption.utils";

export interface ObjectServiceOption {
    option: tTableOption,
    beforeConfirm?: () => void | Promise<void>,
    beforeCancel?: () => void | Promise<void>,
    multiple?: boolean,
}

export function useObject() {

    const $dialog = useDialog()

    const $object = ({option}: { option: tTableOption }) => {
        const dfd = defer<PlainObject | PlainObject[]>()

        const dlgOpt: DialogServiceOption = {
            title: option.config.title,
            render: () => <>
                <PlTablePro option={option}/>
            </>,
            dialogProps: {
                closeOnConfirm: false,
            },
            onConfirm: () => {

            },
            onCancel: () => {

            },
        }

        $dialog(dlgOpt)

        return dfd.promise
    }

    return {$object}
}

export default useObject
