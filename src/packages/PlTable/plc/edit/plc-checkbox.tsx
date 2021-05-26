import React from "react";
import {designPlc} from "../core/designPlc";
import PlCheckbox from "../../../PlCheckbox";

export default designPlc({
    name: 'plc-checkbox',
    standardProps: {
        addEditPadding: {default: true},
    },
    externalProps: {
        trueValue: {default: 'Y' as any},
        falseValue: {default: 'N' as any},
    },
    setup: (props) => {
        return {props}
    },
}, {
    summary: () => null,
    default: ({row, plc, refer}) => !plc.props.field ? null :
        <PlCheckbox
            disabled
            v-model={row[plc.props.field]}
            trueValue={refer.props.trueValue}
            falseValue={refer.props.falseValue}
        />,
    edit: ({row, plc, refer}) => !plc.props.field ? null :
        <PlCheckbox
            v-model={row[plc.props.field]}
            trueValue={refer.props.trueValue}
            falseValue={refer.props.falseValue}
        />,
})