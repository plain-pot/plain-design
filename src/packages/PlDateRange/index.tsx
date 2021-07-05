import {computed, designComponent, PropType, useModel} from "plain-design-composition";
import React from "react";
import {DatePanel, getDefaultDateFormatter} from "../PlDate/date.utils";
import PlInputGroup from "../PlInputGroup";
import PlDate from "../PlDate";
import PlInput from "../PlInput";
import {plainDate} from "../../utils/plainDate";

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
    emits: {
        onUpdateStart: (val?: string) => true,
        onUpdateEnd: (val?: string) => true,
        onBlur: () => true,
    },
    setup({props, event: {emit}}) {

        const format = computed(() => {
            const {displayFormat, valueFormat} = getDefaultDateFormatter(props.panel, props.datetime)
            return {
                displayFormat: props.displayFormat || displayFormat,
                valueFormat: props.valueFormat || valueFormat,
            }
        })

        const startModel = useModel(() => props.start, emit.onUpdateStart)
        const endModel = useModel(() => props.end, emit.onUpdateEnd)
        const placeValue = computed(() => (startModel.value || '') + (endModel.value || ''))

        const pdValue = computed(() => ({
            spd: !!startModel.value ? plainDate(startModel.value, format.value) : null,
            epd: !!endModel.value ? plainDate(endModel.value, format.value) : null,
        }))

        const publicDateAttrs = computed(() => ({
            inputAttrs: {clearIcon: undefined, suffixIcon: undefined, align: 'center' as any},
            ...format.value,
            onBlur: handler.onBlur,
            datetime: props.datetime,
            panel: props.panel,
            fillGroup: true,
        }))

        const handler = {
            onClear: () => {
                if (!!startModel.value) {startModel.value = undefined}
                if (!!endModel.value) {endModel.value = undefined}
            },
            onStartChange: (val?: string) => {
                startModel.value = val
            },
            onEndChange: (val?: string) => {
                endModel.value = val
            },
            onBlur: () => {
                let {spd, epd} = pdValue.value
                if (!spd || !epd) {return emit.onBlur()}
                if (spd.YMDHms <= epd.YMDHms) {return;}
                [spd, epd] = [epd, spd]
                startModel.value = spd.getValue()
                endModel.value = epd.getValue()
                emit.onBlur()
            },
        }

        return {
            render: () => (
                <PlInputGroup block>
                    <PlDate
                        {...publicDateAttrs.value}
                        modelValue={startModel.value}
                        onChange={handler.onStartChange as any}
                    />
                    <PlInput modelValue="~" readonly align="center" width={36}/>
                    <PlDate
                        modelValue={endModel.value}
                        {...publicDateAttrs.value}
                        onChange={handler.onEndChange as any}
                    />
                    <PlInput
                        customReadonly
                        align="center"
                        suffixIcon="el-icon-date"
                        placeValue={placeValue.value}
                        clearHandler={handler.onClear}
                        clearIcon
                        nativeAttrs={{style: {padding: 0, width: '36px'},}}/>
                </PlInputGroup>
            )
        }
    },
})

export default PlDateRange