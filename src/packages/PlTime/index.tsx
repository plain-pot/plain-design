import {computed, designComponent, useModel} from 'plain-design-composition'
import './time.scss'
import {StyleProps} from "../../use/useStyle";
import {EditProps} from "../../use/useEdit";
import {TimePanelProps} from "./panel/PlTimePanel";
import {plainDate} from "../../utils/plainDate";
import {TimeRangePanelType} from "./panel/PlTimeRangePanel";
import {delay} from "plain-utils/utils/delay";
import {useEditPopperAgent} from '../useEditPopperAgent/useEditPopperAgent';
import React from "react";
import {useTime} from "./useTime";
import {PlInput} from "../PlInput";
import {useDateTime} from "../PlDateTimeInput/useDateTime";
import {PlDateTimeInput} from "../PlDateTimeInput";

export const PlTime = designComponent({
    name: 'pl-time',
    props: {
        ...StyleProps,
        ...EditProps,
        ...TimePanelProps,
    },
    emits: {
        onUpdateModelValue: (val?: string) => true,
        onUpdateStart: (val?: string) => true,
        onUpdateEnd: (val?: string) => true,
        onBlur: (e: React.FocusEvent) => true,
        onFocus: (e: React.FocusEvent) => true,
    },
    slots: ['foot'],
    expose: {plainDate},
    setup({props, slots, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const startModel = useModel(() => props.start, emit.onUpdateStart)
        const endModel = useModel(() => props.end, emit.onUpdateEnd)

        const formatData = computed(() => ({
            value: !model.value ? null : plainDate(model.value, props),
            start: !startModel.value ? null : plainDate(startModel.value, props),
            end: !endModel.value ? null : plainDate(endModel.value, props),
        }))

        const serviceHandler = {
            onChange: (val: string | undefined, type?: TimeRangePanelType) => {
                // console.log('service change', {val, type})
                if (!props.range) {
                    model.value = val
                } else {
                    if (type === TimeRangePanelType.start) {
                        startModel.value = val
                    } else {
                        endModel.value = val
                    }
                }
            },
            onMousedownBasePanel: async () => {
                agentState.state.focusCounter++
                await delay(0)
                refs.valueInput!.methods.focus()
            },
            onMousedownStartPanel: async () => {
                agentState.state.focusCounter++
                await delay(0)
                refs.startInput!.methods.focus()
            },
            onMousedownEndPanel: async () => {
                agentState.state.focusCounter++
                await delay(0)
                refs.endInput!.methods.focus()
            }
        }

        const agentState = useEditPopperAgent({
            event: {emit},
            serviceGetter: useTime,
            option: {
                reference: () => refs.plInput?.refs.input,
                renderAttrs: () => ({
                    ...(Object.keys(TimePanelProps).reduce((ret: any, key) => {
                        ret[key] = (props as any)[key]
                        return ret
                    }, {})),
                    modelValue: model.value,
                    start: startModel.value,
                    end: endModel.value,
                    ...serviceHandler,
                    foot: slots.foot.isExist() ? slots.foot : undefined,
                })
            },
        })

        const {
            refs,
            handler,
            inputValue,
            onRef,
        } = useDateTime({
            value: model,
            start: startModel,
            end: endModel,
            props,
            agentState,
            emit,
        })

        const customHandler = {
            change: (val: string | undefined, type: 'start' | 'end' | 'value') => {

                if (!val) {
                    /*清空值*/
                    switch (type) {
                        case "value":
                            return model.value = undefined
                        case "start":
                            return startModel.value = undefined
                        case "end":
                            return endModel.value = undefined
                    }
                }

                let vpd = plainDate.parse(val, props.displayFormat)

                if (!vpd) {
                    /*值解析失败*/
                    return
                }

                if (vpd.format(props.displayFormat) !== val) {
                    /*值格式不正确*/
                    return
                }

                switch (type) {
                    case "value":
                        return model.value = vpd.format(props.valueFormat)
                    case "start":
                        return startModel.value = vpd.format(props.valueFormat)
                    case "end":
                        return endModel.value = vpd.format(props.valueFormat)
                }
            },
        }

        return {
            render: () => (
                <PlInput
                    ref={onRef.plInput}
                    className="pl-time pl-input-custom"
                    modelValue={inputValue.value}
                    suffixIcon="el-icon-time"
                    clearIcon
                    isFocus={agentState.state.focusCounter > 0}
                    width={null as any}
                    inputInnerTabindex={null as any}
                    clearHandler={handler.clearHandler}
                    onClickInput={handler.clickInput}
                    onKeydown={handler.keydown}>
                    <div className='pl-input-custom-inner' {...{range: String(props.range)}}>
                        {!props.range ? (
                            <PlDateTimeInput
                                ref={onRef.valueInput}
                                modelValue={!formatData.value.value ? undefined : formatData.value.value.getDisplay()}
                                displayFormat={props.displayFormat}
                                onChange={(val: string | undefined) => customHandler.change(val, 'value')}
                                onFocus={handler.customInputFocus}
                                onBlur={handler.customInputBlur}/>
                        ) : (
                            <>
                                <PlDateTimeInput
                                    ref={onRef.startInput}
                                    width="100"
                                    modelValue={!formatData.value.start ? undefined : formatData.value.start.getDisplay()}
                                    displayFormat={props.displayFormat}
                                    onChange={(val: string | undefined) => customHandler.change(val, 'start')}
                                    onFocus={handler.customInputFocus}
                                    onBlur={handler.customInputBlur}/>
                                <span>~</span>
                                <PlDateTimeInput
                                    ref={onRef.endInput}
                                    width="100"
                                    modelValue={!formatData.value.end ? undefined : formatData.value.end.getDisplay()}
                                    displayFormat={props.displayFormat}
                                    onChange={(val: string | undefined) => customHandler.change(val, 'end')}
                                    onFocus={handler.customInputFocus}
                                    onBlur={handler.customInputBlur}/>
                            </>)
                        }
                    </div>
                </PlInput>
            )
        }
    },
})

export default PlTime