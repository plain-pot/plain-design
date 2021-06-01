import React from "react";
import {designPlc} from "../core/designPlc";
import PlSelect from "../../../PlSelect";

export default designPlc({
    name: 'plc-select',
    standardProps: {},
    externalProps: {},
    setup(props) {return {props}},
}, {
    summary: () => null,
    /*default: ({row, plc, refer}) => !plc.props.field ? null : (
        <PlSelect
            disabled
            v-model={row[plc.props.field]}>
        </PlSelect>
    ),*/
    edit: ({row, plc, refer}) => !plc.props.field ? null : (
        <PlSelect
            v-model={row[plc.props.field]}>
        </PlSelect>
    ),
})