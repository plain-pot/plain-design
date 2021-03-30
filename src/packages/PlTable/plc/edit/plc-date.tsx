import {designPlc} from "../core/designPlc";
import PlDate from "../../../PlDate";
import React from "react";

export default designPlc({
    name: 'plc-date',
}, {
    edit: ({row, plc}) => !plc.props.field ? null : <PlDate v-model={row[plc.props.field]}/>
},)