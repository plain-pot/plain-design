import {computed, designComponent, PropType} from "plain-design-composition";
import React from "react";
import {DatePanel, getDefaultDateFormatter} from "../PlDate/date.utils";
import PlInputGroup from "../PlInputGroup";
import PlDate from "../PlDate";

export const PlDateRange = designComponent({
    name: 'pl-date-range',
    props: {
        start: {type: String},
        end: {type: String},
        displayFormat: {type: String},
        valueFormat: {type: String},
        panel: {type: String as PropType<keyof typeof DatePanel>, default: DatePanel.date},
        datetime: {type: Boolean},
    },
    setup({props}) {

        const format = computed(() => {
            const {displayFormat, valueFormat} = getDefaultDateFormatter(props.panel, props.datetime)
            return {
                displayFormat: props.displayFormat || displayFormat,
                valueFormat: props.valueFormat || valueFormat,
            }
        })

        return {
            render: () => (
                <PlInputGroup>
                    <PlDate inputAttrs={{clearIcon: undefined, suffixIcon: undefined, align: 'center'}}/>
                    <PlDate inputAttrs={{clearIcon: undefined, suffixIcon: undefined, align: 'center'}}/>
                </PlInputGroup>
            )
        }
    },
})

export default PlDateRange