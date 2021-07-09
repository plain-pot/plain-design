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
                <PlTablePro option={tableOption}/>
            </>,
            dialogProps: {
                closeOnConfirm: false,
                width: '75vw',
                vertical: 'center',
            },
            onConfirm: () => {

            },
            onCancel: () => {

            },
        }

        $dialog(dlgOpt)

        return dfd.promise as any
    }

    return {$object}
}

export default useObject
