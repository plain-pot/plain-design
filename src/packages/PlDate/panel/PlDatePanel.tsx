import {DateEmitRangeType, DatePanel, DatePublicEmits, DatePublicProps, DefaultDateFormatString} from "../date.utils";
import {computed, designComponent, PropType, useModel} from "plain-design-composition";
import {ReactNode} from "react";
import {PlDatePanelYear} from "./PlDatePanelYear";
import {PlDatePanelMonth} from "./PlDatePanelMonth";
import {PlDatePanelRange} from "./PlDatePanelRange";
import {PlDatePanelDate} from "./PlDatePanelDate";
import {PlDatePanelWeek} from "./PlDatePanelWeek";
import {PlDatePanelQuarter} from "./PlDatePanelQuarter";
import React from "react";

export const PlDatePanel = designComponent({
    name: 'pl-date-panel',
    props: {
        ...DatePublicProps,
        panel: {type: String as PropType<DatePanel>, default: DatePanel.date},
        foot: {type: Function as PropType<() => ReactNode>},
    },
    emits: {
        ...DatePublicEmits,
        onMousedown: (e: React.MouseEvent, type?: DateEmitRangeType) => true,
    },
    setup({props, event: {emit}}) {

        const model = useModel(() => props.modelValue as any, emit.onUpdateModelValue)
        const startModel = useModel(() => props.start, emit.onUpdateStart)
        const endModel = useModel(() => props.end, emit.onUpdateEnd)

        const handler = {
            onChange: (val: string | string[] | undefined, type?: DateEmitRangeType) => {
                if (!props.range || props.multiple) {
                    model.value = val
                } else {
                    if (type === DateEmitRangeType.start) {
                        startModel.value = val as string | undefined
                    } else {
                        endModel.value = val as string | undefined
                    }
                    emit.onUpdateModelValue(val, type)
                }
            }
        }

        const binding = computed(() => {
            const {range, max, min, displayFormat, valueFormat, firstWeekDay, defaultTime, defaultStartTime, defaultEndTime, datetime, multiple} = props
            const panel = props.panel
            const value = model.value
            const start = startModel.value
            const end = endModel.value
            const publicProps = {range, modelValue: value, start, end, max, min, firstWeekDay, defaultTime, defaultStartTime, defaultEndTime, datetime, multiple}

            return {
                name: {
                    [DatePanel.year]: PlDatePanelYear,
                    [DatePanel.month]: PlDatePanelMonth,
                    [DatePanel.date]: range ? PlDatePanelRange : PlDatePanelDate,
                    [DatePanel.week]: PlDatePanelWeek,
                    [DatePanel.quarter]: PlDatePanelQuarter,
                }[panel] as any,
                attrs: {
                    ...publicProps,
                    onChange: handler.onChange,
                    onMouseDown: emit.onMousedown,
                    displayFormat: displayFormat || DefaultDateFormatString[panel],
                    valueFormat: valueFormat || DefaultDateFormatString[panel],
                },
            }
        })

        return {
            render: () => {
                const {name: Component, attrs} = binding.value
                return <>
                    <Component {...attrs}/>
                    {!!props.foot && <div className="pl-date-panel-foot" onMouseDown={emit.onMousedown}>
                        {props.foot()}
                    </div>}
                </>
            }
        }
    },
})