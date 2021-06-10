import React, {ReactElement} from "react";
import PlSelect from "../../../PlSelect";
import {designComponent} from "plain-design-composition";
import {createFilterConfigProp, PlcEmitsOptions, PlcPropsOptions} from "../utils/plc.utils";
import {PlcScopeSlotsOptions} from "../utils/plc.scope-slots";
import {useExternalPlc} from "../core/useExternalPlc";
import {isFragment} from 'react-is'

export default designComponent({
    name: 'plc-select',
    props: {
        ...PlcPropsOptions,
        filterName: {type: String, default: 'select'},
        filterHandler: {type: String, default: '等于'},
        filterConfig: createFilterConfigProp(filter => ({options: filter.plc!.slots.options()})),
    },
    scopeSlots: PlcScopeSlotsOptions,
    emits: PlcEmitsOptions,
    slots: ['default', 'options'],
    setup({props, scopeSlots, event, slots}) {
        return useExternalPlc({
            props, slots, scopeSlots, event, defaultScopeSlots: {
                summary: () => null,
                normal: (scope) => {
                    if (!props.field) {return null}
                    const val = scope.row[props.field]

                    let content = scopeSlots.normal.isExist() ? scopeSlots.normal(scope) : slots.default()
                    const children = (isFragment(content) ? content.props.children : content) as ReactElement[]
                    const selectedOption = !children ? null : children.find(child => child.props.val === val)

                    return !selectedOption ? val : (selectedOption.props.children || selectedOption.props.label)
                },
                edit: ({row, plc, node}) => !plc.props.field ? null : (
                    <PlSelect v-model={row[plc.props.field]}>
                        {scopeSlots.normal.isExist() ? scopeSlots.normal({plc, node, row}) : slots.default()}
                    </PlSelect>
                ),
            }
        })
    },
})