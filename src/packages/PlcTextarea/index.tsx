import {designComponent} from "plain-design-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../PlTable/plc/utils/plc.utils";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";
import {PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";
import useDialog from "../useDialog";
import {PlTextareDialog} from "./PlTextareaDialog";
import React from "react";

export const PlcTextarea = designComponent({
    name: 'plc-textarea',
    props: {
        ...createPlcPropOptions({
            link: true,
            width: 255,
        }),

    },
    emits: PlcEmitsOptions,
    scopeSlots: PlcScopeSlotsOptions,
    setup({props, scopeSlots, event}) {

        const $dialog = useDialog()

        event.on.onClick(({scope: {row, plc, node}}) => {
            const val = !plc.props.field ? null : row[plc.props.field]
            if (node.edit) {return}
            if (!!val) {
                $dialog({
                    editType: 'textarea',
                    editValue: val,
                })
            }
        })

        return useExternalPlc({
            props, scopeSlots, event, defaultScopeSlots: {
                edit: ({plc, row}) => !plc.props.field ? null : <PlTextareDialog v-model={row[plc.props.field]}/>
            }
        })
    },
})

export default PlcTextarea