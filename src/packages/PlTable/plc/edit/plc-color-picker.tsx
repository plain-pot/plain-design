import {designPlc} from "../core/designPlc";
import React from "react";
import PlColorPicker from "../../../PlColorPicker";
import PlColorButton from "../../../PlColorButton";

export default designPlc({
    name: 'plc-color-picker',
}, {
    default: ({row, plc}) => {
        return !!plc.props.field && <>
            <PlColorButton color={row[plc.props.field]} style={{marginRight: '6px'}}/>
            {row[plc.props.field]}
        </>
    },
    edit: ({row, plc}) => !plc.props.field ? null : <PlColorPicker v-model={row[plc.props.field]}/>
},)