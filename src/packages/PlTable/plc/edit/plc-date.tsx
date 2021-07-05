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
        filterName: {type: String, default: 'date'},
        filterHandler: {type: String, default: '范围'},
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, slots, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, slots, event, defaultScopeSlots: {
                edit: ({row, plc}) => !plc.props.field ? null : <PlDate v-model={row[plc.props.field]}/>
            }
        })
    },
})