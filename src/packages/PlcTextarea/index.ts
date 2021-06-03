import {designComponent} from "plain-design-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../PlTable/plc/utils/plc.utils";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";
import {PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";
import useDialog from "../useDialog";

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

        event.on.onClick(({scope: {row, plc}}) => {
            const val = !plc.props.field ? null : row[plc.props.field]
            if (!!val) {
                $dialog({
                    editType: 'textarea',
                    editValue: val,
                })
            }
        })

        return useExternalPlc({
            props, scopeSlots, event, defaultScopeSlots: {}
        })
    },
})

export default PlcTextarea