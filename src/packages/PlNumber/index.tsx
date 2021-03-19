import {computed, designComponent, reactive, useModel, useNumber} from "plain-design-composition";
import {StyleProps, useStyle} from "../../use/useStyle";
import {EditProps, useEdit} from "../../use/useEdit";
import {useRefs} from "../../use/useRefs";
import {getKey, KEY} from "../keyboard";
import {PlInput} from "../PlInput";
import React from "react";
import useClass from "plain-design-composition/src/use/useClasses";
import PlIcon from "../PlIcon";
import {useClickWave} from "../../directives/ClickWave";
import './number.scss'

const NAN = 'NAN'

export const PlNumber = designComponent({
    name: 'pl-number',
    props: {
        ...StyleProps,
        ...EditProps,

        modelValue: {type: [String, Number]},                       // 双向绑定值
        min: {type: [String, Number]},                              // 最小值
        max: {type: [String, Number]},                              // 最大值
        step: {type: [String, Number], default: 1},                 // 计数器步长
        stepStrictly: {type: Boolean},                              // 是否只能输入 step 的倍数
        precision: {type: [Number, String]},                        // 数值精度
        hideButton: {type: Boolean},                                // 隐藏操作按钮

        /*---------------------------------------input-------------------------------------------*/
        inputProps: {type: Object},                                 // pl-input属性配置对象
    },
    emits: {
        onFocus: (e: Event) => true,
        onBlur: (e: Event) => true,
        onUpdateModelValue: (val: string | number | undefined) => true,
        onEnter: (e: KeyboardEvent) => true,
    },
    setup({props, event: {emit}}) {

        const {refs, onRef} = useRefs({
            add: HTMLDivElement,
            sub: HTMLDivElement,
        })

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue, {autoEmit: false})
        useStyle({status: undefined})
        const {editComputed} = useEdit()
        const state = reactive({
            isFocus: false,                                         // 当前是否获取焦点
            interval: null as null | number,                        // 进步器长摁定时器
        })

        const {numberState} = useNumber(props, ['step', 'max', 'min', 'precision'])

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            getValue: (val: any): undefined | number | 'NAN' => {
                if (val == null) return undefined
                val = String(val).trim()
                if (val === '') return undefined
                val = Number(val)
                if (isNaN(val)) {
                    return NAN
                } else {
                    return val
                }
            },
            getEffectiveValue: (): number | undefined => {
                let value = formatModelValue.value
                if (value === NAN) {
                    value = formatValue.value
                    if (value === NAN) {
                        if (numberState.min != null) return numberState.min
                        else if (numberState.max != null) return numberState.max
                        else if (props.stepStrictly) return numberState.step
                        else return 0
                    }
                }
                return value
            },
            checkValue: (value: number | undefined): number | undefined => {
                if (value != null) {
                    // min
                    if (numberState.min != null && value < numberState.min) {
                        value = numberState.min
                    }
                    // max
                    if (numberState.max != null && value! > numberState.max) {
                        value = numberState.max
                    }
                    // stepStrictly
                    if (props.stepStrictly && value! % numberState.step! !== 0) {
                        // console.log('props.value', props.modelValue)
                        value = props.modelValue == undefined ? undefined : Number(props.modelValue)
                    }
                    // precision
                    if (numberState.precision != null) {
                        value = Number(value!.toFixed(numberState.precision))
                    }
                }
                return value
            }
        }

        /*---------------------------------------computer-------------------------------------------*/

        const classes = useClass(() => ([
            `pl-number`,
            {
                'pl-number-hide-button': props.hideButton,
                'pl-number-disabled': editComputed.value.disabled,
            }
        ]))
        const formatModelValue = computed(() => utils.getValue(model.value))
        const formatValue = computed(() => utils.getValue(props.modelValue))

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            add: () => {
                if (!editComputed.value.editable) {
                    return
                }
                let value = utils.getEffectiveValue()
                if (value == null) {
                    value = 0
                }
                value += numberState.step
                value = utils.checkValue(value)
                model.value = value
                emit.onUpdateModelValue(model.value)
            },
            minus: () => {
                if (!editComputed.value.editable) {
                    return
                }
                let value = utils.getEffectiveValue()
                if (value == null) {
                    value = 0
                }
                value -= numberState.step
                value = utils.checkValue(value)
                model.value = value
                emit.onUpdateModelValue(model.value)
            },
            clearInterval: () => {              // 清除定时器
                if (state.interval != null) {
                    clearInterval(state.interval)
                }
                window.removeEventListener('mouseup', methods.clearInterval)
            }
        }

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            focus: (e: React.FocusEvent) => {
                state.isFocus = true
                emit.onFocus(e.nativeEvent)
            },
            blur: (e: React.FocusEvent) => {
                model.value = utils.checkValue(utils.getEffectiveValue())
                emit.onUpdateModelValue(model.value)
                state.isFocus = false
                emit.onBlur(e.nativeEvent)
            },
            input: (e: React.ChangeEvent<HTMLInputElement>) => {
                if ((e.nativeEvent as any).inputType === 'insertCompositionText') {return}
                model.value = e.target.value
            },
            enter: (e: KeyboardEvent) => {
                model.value = utils.checkValue(utils.getEffectiveValue())
                emit.onUpdateModelValue(model.value)
                emit.onEnter(e)
            },
            intervalAdd: () => {
                methods.add()
                state.interval = setInterval(methods.add, 100) as any as number
                window.addEventListener('mouseup', methods.clearInterval)
            },
            intervalMinus: () => {
                methods.minus()
                state.interval = setInterval(() => methods.minus(), 100) as any as number
                window.addEventListener('mouseup', methods.clearInterval)
            },
            clearHandler: () => {
                model.value = undefined
                emit.onUpdateModelValue(model.value)
            },
            keydown: (e: React.KeyboardEvent) => {
                const key = getKey(e.nativeEvent)
                switch (key) {
                    case KEY.up:
                        e.preventDefault()
                        e.stopPropagation()
                        methods.add()
                        break
                    case KEY.down:
                        e.preventDefault()
                        e.stopPropagation()
                        methods.minus()
                        break
                    case KEY.enter:
                        handler.enter(e.nativeEvent)
                        break
                }
            },
        }

        useClickWave({elGetter: () => refs.add, optionsGetter: () => ({size: 'large', disabled: !editComputed.value.editable})})
        useClickWave({elGetter: () => refs.sub, optionsGetter: () => ({size: 'large', disabled: !editComputed.value.editable})})

        return {
            refer: {
                ...methods,
            },
            render: () => (
                <PlInput className={classes.value}
                         isFocus={state.isFocus}
                         inputInnerTabindex={null as any}
                         {...(props.inputProps || {})}
                >
                    {!props.hideButton && (
                        <div className="pl-number-prepend-button plain-click-node" onMouseDown={handler.intervalMinus} ref={onRef.sub}>
                            <PlIcon icon="el-icon-minus"/>
                        </div>
                    )}
                    <input type="text"
                           value={model.value || ''}
                           disabled={editComputed.value.disabled!}
                           readOnly={editComputed.value.readonly!}
                           onFocus={handler.focus}
                           onBlur={handler.blur}
                           onInput={handler.input}
                           onKeyDown={handler.keydown}/>
                    {!props.hideButton && (
                        <div className="pl-number-append-button plain-click-node" onMouseDown={handler.intervalAdd} ref={onRef.add}>
                            <PlIcon icon="el-icon-plus"/>
                        </div>
                    )}
                </PlInput>
            )
        }
    },
})