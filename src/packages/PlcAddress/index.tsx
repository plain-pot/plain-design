import {designComponent} from "plain-design-composition";
import {PlcEmitsOptions, PlcPropsOptions} from "../PlTable/plc/utils/plc.utils";
import {PlcScopeSlotsOptions} from "../PlTable/plc/utils/plc.scope-slots";
import {useExternalPlc} from "../PlTable/plc/core/useExternalPlc";
import {isFragment} from "react-is";
import React, {ReactElement} from "react";
import PlSelect from "../PlSelect";
import useAddress from "../useAddress";
import PlAddress from "../PlAddress";

export const PlcAddress = designComponent({
    props: {
        ...PlcPropsOptions,

        parentValue: {type: String},                        // 父值
        parentField: {type: String},                        // 父值所在字段名称
        province: {type: Boolean, default: false},          // 是否为选择省份
        city: {type: Boolean, default: false},              // 是否为选择城市
        district: {type: Boolean, default: false},          // 是否为选择区县
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    setup({props, scopeSlots, event, slots}) {
        const {$address} = useAddress()

        return useExternalPlc({
            props, slots, scopeSlots, event, defaultScopeSlots: {
                normal: (scope) => {
                    return !scope.plc.props.field ? null : $address.getNameByCodeComputed(scope.row[scope.plc.props.field])
                },
                edit: ({row, plc}) => !plc.props.field ? null : (
                    <PlAddress
                        province={props.province}
                        city={props.city}
                        district={props.district}
                        parentValue={props.parentValue != null ? props.parentValue : (!!props.parentField ? row[props.parentField] : undefined)}
                    />
                ),
            }
        })
    },
})

export default PlcAddress
