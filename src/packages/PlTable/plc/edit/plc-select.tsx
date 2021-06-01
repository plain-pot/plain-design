import React from "react";
import PlSelect from "../../../PlSelect";
import {designComponent} from "plain-design-composition";
import {PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    name: 'plc-select',
    props: {
        ...PlcPropsOptions,
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, event, defaultScopeSlots: {
                summary: () => null,
                /*default: ({row, plc, refer}) => !plc.props.field ? null : (
                    <PlSelect
                        disabled
                        v-model={row[plc.props.field]}>
                    </PlSelect>
                ),*/
                edit: ({row, plc}) => !plc.props.field ? null : (
                    <PlSelect
                        v-model={row[plc.props.field]}>
                    </PlSelect>
                ),
            }
        })
    },
})