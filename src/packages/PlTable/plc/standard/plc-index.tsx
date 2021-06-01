import React from "react";
import {designComponent} from "plain-design-composition";
import {PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";

export default designComponent({
    name: 'plc-index',
    props: {
        ...PlcPropsOptions,
        autoFixedLeft: {default: true},
        order: {default: -9999},
        width: {default: 45},
        align: {default: 'center'},
        noPadding: {default: true},

        summaryText: {type: String, default: '合计'},
        start: {type: Number, default: 0},
    },
    scopeSlots: {
        ...PlcScopeSlotsOptions,
    },
    emits: {
        ...PlcEmitsOptions,
    },
    setup({props, scopeSlots, event}) {
        return useExternalPlc({
            props, scopeSlots, event, defaultScopeSlots: {
                head: () => '#',
                default: ({node, plc}) => (plc.props as any).start + node.index + 1,
                summary: () => <span className="plc-index-summary-text">{props.summaryText}</span>,
            }
        })
    },
})