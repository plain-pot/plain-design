import React from "react";
import {PlRate} from "../../../PlRate";
import {designComponent} from "plain-design-composition";
import {createPlcPropOptions, PlcEmitsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    name: 'plc-rate',
    props: {
        ...createPlcPropOptions({
            addEditPadding: true,
        }),
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, event, defaultScopeSlots: {
                normal: ({row, plc}) => !plc.props.field ? null : <PlRate disabled v-model={row[plc.props.field]}/>,
                edit: ({row, plc}) => !plc.props.field ? null : <PlRate v-model={row[plc.props.field]}/>,
            }
        })
    },
})