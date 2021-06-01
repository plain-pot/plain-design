import React from "react";
import {designPlc} from "../core/designPlc";

export default designPlc({
    name: 'plc-index',
    standardProps: {
        autoFixedLeft: {default: true},
        order: {default: -9999},
        width: {default: 45},
        align: {default: 'center'},
        noPadding: {default: true},
    },
    externalProps: {
        summaryText: {type: String, default: '合计'},
        start: {type: Number, default: 0},
    },
}, {
    head: () => '#',
    default: ({node, plc}) => (plc.props as any).start + node.index + 1,
    summary: ({props}) => <span className="plc-index-summary-text">{props.summaryText}</span>,
})