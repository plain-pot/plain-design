import PlDate from "../../../PlDate";
import React from "react";
import {designComponent} from "plain-design-composition";
import {PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";
// import {PlDate} from "../../../date/date";

export default designComponent({
    name: 'plc-date',
    props: {
        ...PlcPropsOptions,
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, event, defaultScopeSlots: {
                edit: ({row, plc}) => !plc.props.field ? null : <PlDate v-model={row[plc.props.field]}/>
            }
        })
    },
})