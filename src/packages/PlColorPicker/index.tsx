import {designComponent, PropType, useModel, useRefs, watch} from 'plain-design-composition'
import './color-picker.scss'
import {EditProps} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {PlInput} from "../PlInput";
import PlColorButton from "../PlColorButton";
import {SimpleFunction} from "plain-design-composition/src/composition/event";
import {reactive} from "@vue/reactivity";
import {useEditPopperAgent} from "../useEditPopperAgent/useEditPopperAgent";
import useColorPicker from "../useColorPicker";
import React from 'react';
import {isEffectiveColorString} from "./utils/ColorUtils";
import $$notice from "../$$notice";

enum ColorPickerType {
    input = 'input',
    button = 'button',
}

export const PlColorPicker = designComponent({
    name: 'pl-color-picker',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: String},                             // 当前颜色值
        enableAlpha: {type: Boolean, default: true},            // 是否启用透明度
        format: {type: String, default: 'hex'},                 // 颜色格式
        type: {type: String as PropType<ColorPickerType>, default: ColorPickerType.input}
    },
    scopeSlots: {
        default: (scope: { color: string, onClick: SimpleFunction }) => {},
    },
    emits: {
        onUpdateModelValue: (val: string | undefined) => true,
        onBlur: (e: Event) => true,
        onFocus: (e: Event) => true,
    },
    setup({props, scopeSlots, event}) {

        useStyle()
        const {refs, onRef} = useRefs({
            input: PlInput,
            button: PlColorButton,
        })

        const model = useModel(() => props.modelValue, event.emit.onUpdateModelValue, {autoWatch: false})
        const state = reactive({
            val: model.value,
            inputValue: props.modelValue,
        })

        const agentState = useEditPopperAgent({
            event,
            serviceGetter: useColorPicker,
            option: {
                reference: () => refs.input?.refs.input || refs.button?.refs.el || scopedSlotsOnClick.el,
                renderAttrs: () => ({
                    modelValue: state.val,
                    enableAlpha: props.enableAlpha,
                    format: props.format,

                    onChange(val) {
                        state.inputValue = val
                        methods.emitValue(val)
                    },
                }),
                popperAttrs: () => ({
                    onMousedownPopper: async () => {
                        agentState.state.focusCounter++
                    },
                    onClickPopper: () => {
                        !!refs.input && refs.input.methods.focus()
                    },
                }),
            },
        })
        const scopedSlotsOnClick = (() => {
            const variable = {
                el: null as null | HTMLDivElement,
                onClick: (e: MouseEvent) => {
                    variable.el = e.target as HTMLDivElement
                    agentState.inputHandler.onClickInput()
                }
            }
            return variable
        })();

        const methods = {
            emitValue(val: any) {
                model.value = val
            },
        }

        const suffixIcon = () => (
            <PlColorButton
                ref={onRef.button}
                color={state.val}
                onClick={agentState.inputHandler.onClickInput}/>
        )

        const inputHandler = {
            onChange: (val: string) => {
                state.inputValue = val
                if (isEffectiveColorString(val)) {
                    methods.emitValue(val)
                }
            },
            /*---------------------------------------override-------------------------------------------*/

            onEnter: (e: KeyboardEvent) => {
                if (!!state.inputValue && state.inputValue !== state.val) {
                    $$notice.warn('请输入有效的颜色值')
                    state.inputValue = state.val
                }
                agentState.inputHandler.onEnter(e)
            },
            onBlur: (e: Event) => {
                agentState.state.focusCounter--
                if (agentState.state.focusCounter === 0) {
                    event.emit.onBlur(e)
                    agentState.methods.hide()
                    state.val = model.value
                    state.inputValue = model.value
                }
            },
        }

        watch(() => props.modelValue, (val) => {
            model.value = val
            state.val = val
            state.inputValue = val
        })

        return {
            render: () => {
                return scopeSlots.default({
                    color: state.val!,
                    onClick: scopedSlotsOnClick.onClick,
                }, (
                    props.type === ColorPickerType.input ? (
                        <PlInput ref={onRef.input}
                                 className="pl-color-picker"
                                 modelValue={state.inputValue}
                                 suffixIcon={suffixIcon}
                                 isFocus={agentState.state.focusCounter > 0}
                                 {...{
                                     ...agentState.inputHandler,
                                     ...inputHandler,
                                 }}/>
                    ) : suffixIcon()
                ))
            }
        }
    },
})

export default PlColorPicker