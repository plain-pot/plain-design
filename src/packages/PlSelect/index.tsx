import './select.scss'
import {EditProps} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {computed, designComponent, PropType, ref, useModel, useRefs} from "plain-design-composition";
import {PlSelectOption, SelectOption} from "../PlSelectOption";
import {PlInput} from "../PlInput";
import {PlSelectPanel} from "./PlSelectPanel";
import {useEditPopperAgent} from "../useEditPopperAgent/useEditPopperAgent";
import {useSelect} from "./useSelect";
import React from "react";
import {handleKeyboard} from "../keyboard";
import {PlInputInnerTags} from "../PlInput/PlInputInnertags";
import PlIcon from "../PlIcon";
import {createEventListener} from "plain-design-composition"
import {useCollect} from "../../use/useCollect";
import {ie} from "plain-utils/utils/ie";
import {classnames} from "plain-design-composition";
import PlPopper from "../PlPopper";

const Props = {
    ...EditProps,
    ...StyleProps,

    modelValue: {type: [String, Number, Array]},
    filterable: {type: Boolean, default: true},                     // 是否可以输入筛选
    inputProps: {type: Object},                                     // input组件绑定属性对象

    multiple: {type: Boolean},                                      // 是否多选
    multipleMaxLimit: {type: Number},                               // 多选最多选择个数
    multipleMinLimit: {type: Number},                               // 多选最少选择个数
    collapseTags: {type: Boolean, default: true},                   // 多选模式下，超过三个选项，其他的将省略显示

    noMatchText: {type: String, default: '暂无匹配数据'},            // 筛选无数据时展示的文本
    noDataText: {type: String, default: '暂无数据'},                // 无数据时显示的文本
    filterMethod: Function,                                         // 筛选过滤函数
    popperAttrs: {type: Object as PropType<Partial<typeof PlPopper.use.props>>},
}

export const PlSelect = designComponent({
    name: 'pl-select',
    props: {
        ...Props,
    },
    emits: {
        onUpdateModelValue: (val?: number | string | string[]) => true,
        onClick: (option: SelectOption) => true,

        onSpace: (e: React.KeyboardEvent) => true,
        onEnter: (e: React.KeyboardEvent) => true,
        onUp: (e: React.KeyboardEvent) => true,
        onDown: (e: React.KeyboardEvent) => true,
        onEsc: (e: React.KeyboardEvent) => true,

        onBlur: (e: React.FocusEvent) => true,
        onFocus: (e: React.FocusEvent) => true,
    },
    slots: ['default'],
    setup({props, slots, event}) {

        useStyle()
        const {refs, onRef} = useRefs({input: PlInput,})

        /*对 pl-select-panel 的引用*/
        let panel = null as typeof PlSelectPanel.use.class | null

        /*---------------------------------------state-------------------------------------------*/

        const model = useModel(() => props.modelValue as number | string | string[] | undefined, event.emit.onUpdateModelValue)
        const filterText = ref(null as string | null)
        const agentState = useEditPopperAgent({
            event,
            serviceGetter: useSelect,
            option: {
                reference: () => refs.input?.refs.input,
                renderAttrs: () => ({
                    ref: r => panel = r,
                    ...(() => {
                        const {loading, readonly, customReadonly, collapseTags, inputProps, filterable, ...leftProps} = Props
                        return Object.keys(leftProps).reduce((ret: any, key) => {
                            ret[key] = (props as any)[key]
                            return ret
                        }, {})
                    })(),
                    modelValue: model.value,
                    height: popperHeight.value,
                    content: slots.default,
                    filterMethod: utils.filterMethod,
                    onChange: handler.onServiceChange,
                    onClick: event.emit.onClick,
                }),
                popperAttrs: ({
                    ...props.popperAttrs as any,
                    onMousedownPopper: () => agentState.state.focusCounter++,
                    onClickPopper: () => refs.input!.methods.focus(),
                    onHide: () => filterText.value = null,
                }),
            },
        })

        /*---------------------------------------utils-------------------------------------------*/

        const utils = {
            filterMethod: (option: { label?: string, val: string, disabled: boolean }) => {
                if (!!props.filterMethod) return props.filterMethod(filterText.value, option)
                return !!filterText.value && !!filterText.value.trim() ? (!!option.label && option.label.indexOf(filterText.value) > -1) : true
            }
        }

        /*---------------------------------------computed-------------------------------------------*/

        /**
         * 收集的option实例
         * @author  韦胜健
         * @date    2020/6/8 11:16
         */
        const items = SelectCollector.parent()
        /**
         * 有效的 pl-select-option
         * @author  韦胜健
         * @date    2020/12/4 10:06
         */
        const formatData = computed(() => items.filter(i => !i.props.group))
        /**
         * popper应该的高度
         * @author  韦胜健
         * @date    2020/12/4 10:06
         */
        const popperHeight = computed(() => formatData.value.length > 6 ? 256 : null)
        /**
         * 显示值
         * @author  韦胜健
         * @date    2020/6/8 11:16
         */
        const displayValue = computed(() => {
            if (!props.multiple) {
                for (let i = 0; i < formatData.value.length; i++) {
                    const item = formatData.value[i];
                    if (item.props.val == model.value) {
                        return item.props.label
                    }
                }
                return model.value
            } else {
                let strings: string[] = []
                if (!!model.value && Array.isArray(model.value)) {
                    for (let i = 0; i < formatData.value.length; i++) {
                        const item = formatData.value[i];
                        if (model.value.indexOf(item.props.val! as string) > -1) {
                            strings.push(item.props.label! as string)
                        }
                    }
                }
                return strings.join('').trim()
            }
        })

        /**
         * 给input组件传递的属性
         * @author  韦胜健
         * @date    2020/12/4 11:21
         */
        const inputProps = computed(() => Object.assign({}, props.inputProps || {}))

        /**
         * 当前显示的空值占位符
         * @author  韦胜健
         * @date    2020/12/4 11:21
         */
        const placeholderValue = computed(() => {
            if (agentState.isShow.value) {
                return displayValue.value
            }
            if (!!inputProps.value.placeholder) {
                return inputProps.value.placeholder
            }
            return agentState.editComputed.value.placeholder
        })

        /**
         * 给input组件绑定的目标对象
         * @author  韦胜健
         * @date    2020/12/4 11:21
         */
        const inputBinding = computed(() => {
            /*onEnter不要了，只要剩余的时间监听器*/
            const {onEnter, ...inputHandler} = agentState.inputHandler
            return {
                ref: onRef.input,
                className: classnames([
                    'pl-select',
                    {
                        'pl-input-tags': !!props.multiple,
                        'pl-select-input-show': agentState.isShow.value,
                    }
                ]),

                modelValue: (props.filterable && agentState.isShow.value) ? filterText.value! : displayValue.value as string,
                placeValue: displayValue.value as string,
                inputReadonly: !props.filterable,
                placeholder: placeholderValue.value,
                suffixIcon: 'el-icon-arrow-down',
                clearIcon: true,
                isFocus: agentState.state.focusCounter > 0,
                clearHandler: handler.onInputClear,

                ...inputHandler,
                onChange: handler.onInputChange,
                onKeydown: handler.onInputKeydown,

                ...inputProps.value,
            }
        })

        const multipleTags = computed(() => {
            if (!model.value) {
                return []
            }
            if (!Array.isArray(model.value)) {
                console.error('The value of multiple select should be array')
                return []
            }
            if (!formatData.value || formatData.value.length === 0) return []
            return formatData.value.filter(option => (model.value as any[]).indexOf(option.props.val!) > -1)
        })

        /*---------------------------------------handler-------------------------------------------*/

        const handler = {
            onInputKeydown: handleKeyboard({
                space: (e) => {
                    if (props.multiple && agentState.isShow.value) {
                        e.stopPropagation()
                        e.preventDefault()
                        panel!.methods.selectHighlight()
                    }
                    event.emit.onSpace(e)
                },
                enter: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (agentState.isShow.value) {
                        panel!.methods.selectHighlight()
                    } else {
                        agentState.methods.show()
                    }
                },
                up: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (!!agentState.isShow.value) {
                        panel!.methods.highlightPrev()
                    }
                },
                down: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (!!agentState.isShow.value) {
                        panel!.methods.highlightNext()
                    }
                },
                esc: (e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    if (!!agentState.isShow.value) {
                        agentState.methods.hide()
                    }
                },
            }),
            onServiceChange: (val: any) => model.value = val,
            onInputClear: () => model.value = undefined,
            onInputChange: (val: string | null) => {
                filterText.value = val
                if (!agentState.isShow.value && ie) {
                    agentState.methods.show()
                }
            },
            onClickItemCloseIcon: (item: SelectOption, index: number) => {
                index = (model.value as any[]).indexOf(item.props.val!)
                if (index > -1) {
                    const value = [...(model.value as any[])]
                    value.splice(index, 1)
                    model.value = [...value]
                }
            }
        }

        return {
            render: () => (
                <PlInput {...inputBinding.value}>
                    {{
                        hidden: slots.default,
                        default: !props.multiple ? null : () => (
                            <PlInputInnerTags
                                data={multipleTags.value}
                                collapseTags={props.collapseTags}
                                placeholder={inputBinding.value.placeholder}
                                default={({item, index}: { item: SelectOption, index: number }) => (
                                    <React.Fragment key={index}>
                                        <span>{item.props.label}</span>,
                                        <PlIcon icon="el-icon-close" {...createEventListener({onClick: () => handler.onClickItemCloseIcon(item, index)})}/>
                                    </React.Fragment>
                                )}
                            />
                        )
                    }}
                </PlInput>
            )
        }
    },
})

export const SelectCollector = useCollect(() => ({
    parent: PlSelect,
    child: PlSelectOption,
}))

export default PlSelect