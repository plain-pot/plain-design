import {designPlc} from "../core/designPlc";
import React from "react";
import {PlInput} from "../../../PlInput";

export default designPlc({
    name: 'plc-input',
}, {
    edit: ({row, plc}) => !plc.props.field ? null : <PlInput v-model={row[plc.props.field]}/>
},)