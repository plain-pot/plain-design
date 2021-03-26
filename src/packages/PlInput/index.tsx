import {computed, designComponent, onMounted, PropType, reactive, useModel, useNumber, useRefs, useStyles, watch} from "plain-design-composition";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import useClass from "plain-design-composition/src/use/useClasses";
import {unit} from "plain-utils/string/unit";
import {getKey, KEY} from "../keyboard";
import {throttle} from "plain-utils/utils/throttle";
import React from "react";
import PlIcon from "../PlIcon";
import {createEventListener} from "plain-design-composition/src/utils/createEventListener";
import PlLoading from "../PlLoading";
import './input.scss'
import {noop} from "../../utils/constant";

console.log('load input component')

export const PlInput = designComponent({
    name: 'pl-input',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {type: String as PropType<string | null>},
        placeValue: {type: [String, Number]},

        width: {type: [Number, String, Object, Function] as PropType<string | number>, default: null,},        // 输入框默认宽度
        minHeight: {type: [Number, String], default: 100},      // 文本域最小高度
        maxHeight: {type: [Number, String] as PropType<string | number | null>, default: 156},                  // 文本域最大高度
        block: {type: Boolean},                                 // 块级元素
        textarea: {type: Boolean},                              // 当前是否为文本域输入框
        suffixIcon: {type: [String, Function]},                 // 右侧图标
        prefixIcon: {type: String},                             // 左侧图标
        clearIcon: {type: Boolean},                             // 清除图标
        clearHandler: Function,                                 // 点击清除图标处理逻辑

        autoHeight: {type: Boolean},                            // 自适应高度
        isFocus: {type: Boolean},                               // 当前是否处于激活状态
        inputReadonly: {type: Boolean},                         // 输入框只读
        throttleEnter: {type: [Boolean, Number]},               // enter按键事件节流
        asyncHandler: {type: Function},                         // 异步处理函数，会自动开启关闭loading状态

        /*---------------------------------------原生属性-------------------------------------------*/
        inputInnerTabindex: {type: Number, default: 0},
        type: {type: String, default: 'text'},
        placeholder: {type: String},
        nativeAttrs: {type: Object},
    },
    inheritPropsType: HTMLDivElement,
    emits: {
        onUpdateModelValue: (val: any) => true,
        onFocus: (e: React.FocusEvent) => true,
        onBlur: (e: React.FocusEvent) => true,
        onKeydown: (e: React.KeyboardEvent) => true,
        onEnter: (e: React.KeyboardEvent) => true,
        onEsc: (e: React.KeyboardEvent) => true,

        onClickInput: (e: React.MouseEvent) => true,
        onClickPrefixIcon: (e: React.MouseEvent) => true,
        onClickSuffixIcon: (e: React.MouseEvent) => true,
        onClickClearIcon: (e: React.MouseEvent) => true,
    },
    slots: ['default', 'prepend', 'append', 'hidden'],
    setup({props, event: {emit}, slots}) {
        const {refs, onRef} = useRefs({
            input: HTMLInputElement,
            hiddenInput: HTMLTextAreaElement,
        })
        const {numberState} = useNumber(props, ['width', 'minHeight', 'maxHeight'])
        const {styleComputed} = useStyle({status: undefined})
        const {editComputed, editState} = useEdit()
        const state = reactive({
            autoHeight: null as null | number,
            handlerEnter: null as null | ((e: React.KeyboardEvent) => void),
            handleEnterInner: async (e: React.KeyboardEvent) => {
                if (editComputed.value.editable) {
                    if (!!props.asyncHandler) {
                        editState.loading = true
                        try {
                            await props.asyncHandler()
                        } catch (e) {
                            console.error(e)
                        } finally {
                            editState.loading = null
                        }
                    } else {
                        emit.onEnter(e)
                    }
                }
            },
        })
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            input: (e: React.ChangeEvent<HTMLInputElement>) => {
                const nativeEvent = e.nativeEvent as any
                if (nativeEvent.inputType === 'insertCompositionText') {return}
                model.value = nativeEvent.target.value
            },
            enter: (e: React.KeyboardEvent) => {
                state.handlerEnter!(e)
            },
            clickPrefixIcon: (e: React.MouseEvent) => {
                if (!editComputed.value.editable) {
                    return
                }
                e.stopPropagation()
                e.preventDefault()
                emit.onClickPrefixIcon(e)
            },
            clickSuffixIcon: (e: React.MouseEvent<any>) => {
                if (!editComputed.value.editable) {
                    return
                }
                e.stopPropagation()
                e.preventDefault()
                emit.onClickSuffixIcon(e)
            },
            clickClearIcon: (e: React.MouseEvent<any>) => {
                if (!editComputed.value.editable) {
                    return
                }
                e.stopPropagation()
                e.preventDefault()
                emit.onClickClearIcon(e)
                if (!!props.clearHandler) {
                    props.clearHandler(e)
                } else {
                    methods.clearValue()
                }
            }
        }

        /*---------------------------------------computed-------------------------------------------*/

        const classes = useClass(() => [
            `pl-input-shape-${styleComputed.value.shape}`,
            `pl-input-size-${styleComputed.value.size}`,
            {
                [`pl-input-status-${styleComputed.value.status}`]: !!styleComputed.value.status,
                'pl-input-block': props.block,
                'pl-input-disabled': !!editComputed.value.disabled,
                'pl-input-prefix-padding': !!props.prefixIcon,
                'pl-input-suffix-padding': !!props.suffixIcon || !!props.clearIcon || editComputed.value.loading,
                'pl-input-prefix': !!props.prefixIcon,
                'pl-input-suffix': !!props.suffixIcon || editComputed.value.loading,
                'pl-input-clear': !!props.clearIcon,
                'pl-input-empty': !model.value && !props.placeValue,
                'pl-input-focus': props.isFocus,
                'pl-input-not-editable': !editComputed.value.editable,
            }
        ])

        const styles = useStyles(styles => {
            /*没有前置以及后置插槽以及非块级元素的情况下，设置宽度*/
            if (numberState.width !== null && !props.block) {
                styles.width = unit(numberState.width)
            }
            /*textarea自动高度的时候，取最大高度最小高度以及滚动高度*/
            if (!!props.textarea) {
                if (!props.autoHeight || state.autoHeight == null) {
                    styles.height = unit(state.autoHeight)
                } else {
                    if (numberState.maxHeight != null && state.autoHeight > numberState.maxHeight) {
                        styles.height = unit(numberState.maxHeight)
                    } else if (state.autoHeight < numberState.minHeight) {
                        styles.height = unit(numberState.minHeight)
                    } else {
                        styles.height = unit(state.autoHeight)
                    }
                }
            }
            return styles
        })

        const publicProps = computed(() => ({
            style: styles.value,
            disabled: editComputed.value.disabled,
            readOnly: props.inputReadonly || editComputed.value.readonly || editComputed.value.loading,
            value: model.value || '',
            placeholder: props.placeholder,
            ...(props.nativeAttrs || {}),

            // 发现一个非常奇怪的现象，div.pl-input-inner 里面的input、派发的input事件，居然也能够在 div.pl-input-inner这个div节点上监听到。神奇
            ...(!slots.default.isExist() ? {
                onInput: (e: Event) => {
                    /*ie 下不知道为什么页面初始化的之后这里默认就执行了一次，这里判断绕过这个问题*/
                    if (e.target === document.activeElement) {
                        handler.input(e as any)
                    }
                },
            } : {}),

            onClick: emit.onClickInput,
            onFocus: emit.onFocus,
            onBlur: emit.onBlur,
            onKeyDown: (e: React.KeyboardEvent) => {
                emit.onKeydown(e)
                switch (getKey(e.nativeEvent)) {
                    case KEY.enter:
                        return handler.enter(e)
                    case KEY.esc:
                        return emit.onEsc(e)
                }
            },
            ref: onRef.input,
        } as any))

        /*---------------------------------------methods-------------------------------------------*/

        const methods = {
            clearValue: () => {
                model.value = undefined
            },
            focus: () => {
                if (!!refs.input && !!refs.input.focus) {
                    refs.input.focus()
                }
            },
            blur: () => {
                if (!!refs.input && !!refs.input.blur) {
                    refs.input.blur()
                }
            },
            /*重置文本域高度*/
            resetTextAreaHeight: throttle(() => {
                if (!!props.autoHeight && !!props.textarea) {
                    setTimeout(() => state.autoHeight = refs.hiddenInput!.scrollHeight + 12, 0)
                }
            }, 300),
        }

        /*---------------------------------------watcher-------------------------------------------*/

        watch(() => model.value, () => {
            methods.resetTextAreaHeight()
        })
        watch(() => props.throttleEnter, (val) => {
            if (!val) {
                state.handlerEnter = state.handleEnterInner
            }
            if (val === true) {
                val = 1000
            }
            state.handlerEnter = throttle(state.handleEnterInner, val as number, {trailing: true})
        }, {immediate: true})

        onMounted(() => {
            if (props.textarea) {
                methods.resetTextAreaHeight()
            }
        })

        return {
            refer: {
                refs,
                state,
                numberState,
                methods,
                model,
            },
            render: () => {

                if (props.textarea) {
                    /*渲染文本域*/
                    return (
                        <div className={'pl-textarea ' + classes.value}>
                            <textarea className="pl-textarea-inner" {...publicProps.value}/>
                            <textarea className="pl-textarea-inner pl-textarea-hidden" ref={onRef.hiddenInput} value={model.value!} onChange={noop}/>
                        </div>
                    )
                } else {
                    /*普通输入框*/
                    const input = (
                        <div className={'pl-input ' + classes.value}>
                            {!!props.prefixIcon && <span className="pl-input-prefix-icon" onClick={handler.clickPrefixIcon}><PlIcon icon={props.prefixIcon}/></span>}

                            {slots.default.isExist() ?
                                <div tabIndex={props.inputInnerTabindex} className="pl-input-inner" {...publicProps.value}>
                                    {slots.default()}
                                </div>
                                :
                                <input className="pl-input-inner" {...publicProps.value}/>}

                            {!!props.suffixIcon && <span className="pl-input-suffix-icon">
                                {typeof props.suffixIcon === 'function' ? (props.suffixIcon as any)() : <PlIcon {...createEventListener({onMouseDown: handler.clickSuffixIcon})} icon={props.suffixIcon}/>}
                            </span>}
                            {!!props.clearIcon && (<span className="pl-input-suffix-icon pl-input-clear-icon"><PlIcon {...createEventListener({onMouseDown: handler.clickClearIcon})} icon="el-icon-error"/></span>)}
                            {!!editComputed.value.loading && <PlLoading className="pl-input-suffix-icon"/>}
                            {slots.hidden.isExist() && <div className="pl-input-inner-hidden">{slots.hidden()}</div>}
                        </div>
                    )

                    if (!slots.prepend.isExist() && !slots.append.isExist()) {
                        return input
                    } else {
                        /*输入框组*/
                        return (
                            <div className="pl-input-group">
                                {slots.prepend.isExist() && <div className="pl-input-prepend">{slots.prepend()}</div>}
                                {input}
                                {slots.append.isExist() && <div className="pl-input-append">{slots.append()}</div>}
                            </div>
                        )
                    }
                }
            }
        }
    },
})