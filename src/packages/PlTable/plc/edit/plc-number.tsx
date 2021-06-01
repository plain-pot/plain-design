import React from "react";
import {designPlc} from "../core/designPlc";
import {PlNumber} from "../../../PlNumber";

export default designPlc({
    name: 'plc-number',
}, {
    edit: ({row, plc}) => !plc.props.field ? null : <PlNumber v-model={row[plc.props.field]}/>
},)