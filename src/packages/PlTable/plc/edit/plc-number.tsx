import React from "react";
import {PlNumber} from "../../../PlNumber";
import {designComponent} from "plain-design-composition";
import {PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    name: 'plc-number',
    props: {
        ...PlcPropsOptions,
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, event, defaultScopeSlots: {
                edit: ({row, plc}) => !plc.props.field ? null : <PlNumber v-model={row[plc.props.field]}/>
            }
        })
    },
})