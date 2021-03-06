import {computed, designComponent, useModel} from "plain-design-composition"
import {TimePublicProps} from "./time-panel.utils";
import {plainDate} from "../../../utils/plainDate";
import React from "react";
import PlTimeBasePanel from "./PlTimeBasePanel";

export enum TimeRangePanelType {
    start = 'start',
    end = 'end',
}

export const PlTimeRangePanel = designComponent({
    name: 'pl-time-range-panel',
    props: {
        start: {type: String},
        end: {type: String},
        ...TimePublicProps,
    },
    emits: {
        onUpdateModelValue: (val: string | undefined, type: TimeRangePanelType) => true,
        onUpdateStart: (val?: string) => true,
        onUpdateEnd: (val?: string) => true,
        onMousedownStartPanel: (e: React.MouseEvent) => true,
        onMousedownEndPanel: (e: React.MouseEvent) => true,
    },
    setup({props, event: {emit}}) {

        const start = useModel(() => props.start, emit.onUpdateStart)
        const end = useModel(() => props.end, emit.onUpdateEnd)

        const formatData = computed(() => {
            return {
                start: !start.value ? null : plainDate(start.value, props),
                end: !end.value ? null : plainDate(end.value, props),
                max: !props.max ? null : plainDate(props.max, props),
                min: !props.min ? null : plainDate(props.min, props),
            }
        })

        const handler = {
            onStartChange: (value?: string) => {
                start.value = value
                emit.onUpdateModelValue(value, TimeRangePanelType.start)

                const {end: endPd, start: startPd} = formatData.value

                if (!endPd || startPd!.Hms! > endPd.Hms) {
                    end.value = start.value
                    emit.onUpdateModelValue(end.value, TimeRangePanelType.end)
                }
            },
            onEndChange: (value?: string) => {
                end.value = value
                emit.onUpdateModelValue(value, TimeRangePanelType.end)
                const {end: endPd, start: startPd} = formatData.value

                if (!startPd || endPd!.Hms! < startPd.Hms) {
                    start.value = end.value
                    emit.onUpdateModelValue(start.value, TimeRangePanelType.start)
                }
            },
        }

        const binding = computed(() => {
            const publicProps = Object.keys(TimePublicProps).reduce((ret: any, key) => {
                ret[key] = (props as any)[key]
                return ret
            }, {})
            const {max, min} = props
            const publicBinding = {
                ...publicProps,
                max,
                min,
                disableChangeOnScroll: true,
            }
            return {
                start: {
                    ...publicBinding,
                    modelValue: start.value,
                    onChange: handler.onStartChange,
                    onMouseDown: emit.onMousedownStartPanel,
                },
                end: {
                    ...publicBinding,
                    modelValue: end.value,
                    onChange: handler.onEndChange,
                    onMouseDown: emit.onMousedownEndPanel,
                },
            }
        })

        return {
            render: () => (
                <div className="pl-time-range-panel">
                    <PlTimeBasePanel {...binding.value.start}/>
                    <PlTimeBasePanel {...binding.value.end}/>
                </div>
            )
        }
    },
})

export default PlTimeRangePanel