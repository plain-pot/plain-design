import React from "react";
import {designPlc} from "../core/designPlc";
import PlToggle from "../../../PlToggle";

export default designPlc({
    name: 'plc-toggle',
    standardProps: {
        addEditPadding: {default: true},
    },
}, {
    summary: () => null,
    default: ({row, plc}) => !plc.props.field ? null : <PlToggle disabled v-model={row[plc.props.field]} trueValue="Y" falseValue="N"/>,
    edit: ({row, plc}) => !plc.props.field ? null : <PlToggle v-model={row[plc.props.field]} trueValue="Y" falseValue="N"/>,
})