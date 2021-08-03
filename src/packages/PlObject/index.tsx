import {designComponent, PropType} from "plain-design-composition";
import {tTableOption} from "../createUseTableOption";
import {PlainObject} from "../createUseTableOption/createUseTableOption.utils";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps} from "../../use/useStyle";
import PlInput from "../PlInput";
import React from "react";
import useObject from "../useObject";

export const PlObject = designComponent({
    props: {
        ...EditProps,
        ...StyleProps,
        option: {type: Object as PropType<tTableOption>},
        row: {type: Object as PropType<PlainObject>},
        map: {type: Object as PropType<Record<string, string> | ((source: PlainObject, selected: PlainObject) => void)>},
        showKey: {type: String},
        beforeSelect: {type: Function as PropType<(row: PlainObject) => void | Promise<void>>},
        afterSelect: {type: Function as PropType<(source: PlainObject, selected: PlainObject) => void | Promise<void>>},
    },
    setup({props}) {

        const {editComputed} = useEdit()
        const {$object} = useObject()

        const open = async () => {

            if (!props.option) {
                throw new Error('PlObject: props.option is necessary!')
            }
            !!props.beforeSelect && await props.beforeSelect(props.row!)
            const selected = await $object({option: props.option, readonly: !editComputed.value.editable,})

            if (!!props.map) {
                if (typeof props.map === "function") {
                    await props.map(props.row!, selected)
                } else {
                    Object.entries(props.map).forEach(([sourceKey, selectKey]) => {
                        props.row![sourceKey] = selected[selectKey]
                    })
                }
            }

            !!props.afterSelect && await props.afterSelect(props.row!, selected)
        }

        return () => (
            <PlInput
                modelValue={!props.row || !props.showKey ? null : props.row[props.showKey]}
                inputReadonly
                suffixIcon="el-icon-search"
                onClick={open}
            />
        )

    },
})

export default PlObject
