import {computed, designComponent, PropType, ref, useModel, useNumber, useRefs, useStyles} from "plain-design-composition";
import {PlSelectOption, SelectOption} from "../PlSelectOption";
import {PlScroll} from "../PlScroll";
import {unit} from "plain-utils/string/unit";
import $$notice from "../$$notice";
import PlIcon from "../PlIcon";
import React from "react";
import {useCollect} from "../../use/useCollect";
import {useClasses} from "plain-design-composition";

export const PlSelectPanel = designComponent({
    name: 'pl-select-panel',
    props: {
        modelValue: {type: [String, Number, Array]},                     // 双向绑定值

        multiple: {type: Boolean},                                      // 是否多选
        multipleMaxLimit: {type: [Number, String]},                     // 多选最多选择个数
        multipleMinLimit: {type: [Number, String]},                     // 多选最少选择个数

        noMatchText: {type: String, default: '暂无匹配数据'},             // 筛选无数据时展示的文本
        noDataText: {type: String, default: '暂无数据'},                 // 无数据时显示的文本
        filterMethod: {type: Function as PropType<(option: { val: string | number, label: string | number, disabled?: boolean }) => boolean>},// 筛选过滤函数
        content: {type: [Object, Function]},                            // 内容虚拟dom或者渲染函数
        height: {type: Number},                                         // 面板高度，超过会显示自定义滚动条

        showDebug: {type: Boolean},
    },
    emits: {
        onUpdateModelValue: (val: number | string | string[]) => true,
        onClick: (option: SelectOption) => true,
    },
    provideRefer: true,
    slots: ['default'],
    setup({props, slots, event: {emit}}) {

        const {numberState} = useNumber(props, ['multipleMaxLimit', 'multipleMinLimit'])

        /*组件引用*/
        const {refs, onRef} = useRefs({scroll: PlScroll})
        /*收集的 select-option 子组件*/
        const items = SelectPanelCollector.parent()
        /*筛选的出有效的 select-option 子组件*/
        const options = computed(() => items.filter(i => !i.props.group))
        /*当前显示的select-option*/
        const showOptions = computed(() => options.value.filter(o => utils.isShow(o.props)))
        /*当前高亮的option.props.val*/
        const current = ref(null as null | SelectOption)
        /*双向绑定值*/
        const model = useModel(() => props.modelValue as number | string | string[], emit.onUpdateModelValue)

        const classes = useClasses(() => [
            'pl-select-panel',
            {
                'pl-select-panel-multiple': props.multiple,
            }
        ])

        const styles = useStyles(style => {!!props.height && (style.height = unit(props.height))})

        const utils = {
            /**
             * 用于option判断当前是否已经被选中
             * @author  韦胜健
             * @date    2020/6/8 9:23
             */
            isSelected: (optionProps: { label: string | number, val: string | number, disabled?: boolean }) => {
                if (!model.value) return false
                if (!props.multiple) {
                    return (model.value as string) == optionProps.val
                } else {
                    return (model.value as string[]).indexOf(optionProps.val! as string) > -1
                }
            },
            isShow: (optionProps: { label: string | number, val: string | number, disabled?: boolean }) => {
                return !props.filterMethod || props.filterMethod(optionProps)
            }
        }

        const handler = {
            /**
             * 处理点击option的动作
             * @author  韦胜健
             * @date    2020/6/8 9:24
             */
            clickOption: (option: SelectOption) => {

                if (option.props.disabled) return

                emit.onClick(option)

                if (!props.multiple) {
                    model.value = option.props.val
                } else {
                    const newValue: any[] = [...((model.value as string[]) || [])]
                    const index = newValue.indexOf(option.props.val!)
                    if (index > -1) {
                        if (!!numberState.multipleMinLimit && newValue.length <= numberState.multipleMinLimit) {
                            return $$notice.warn(`最少选择 ${numberState.multipleMinLimit} 个选项`)
                        }
                        newValue.splice(index, 1)
                    } else {
                        if (!!numberState.multipleMaxLimit && newValue.length >= numberState.multipleMaxLimit) {
                            return $$notice.warn(`最多选择 ${numberState.multipleMaxLimit} 个选项`)
                        }
                        newValue.push(option.props.val!)
                    }
                    model.value = [...newValue]
                }
            },
        }

        const methods = {
            /**
             * 高亮上一个元素
             * @author  韦胜健
             * @date    2020/6/8 9:18
             */
            highlightPrev: () => {
                if (showOptions.value.length === 0) {
                    return
                }
                if (!current.value) {
                    current.value = showOptions.value[showOptions.value.length - 1]

                    // 滚动到高亮的选项
                    if (!!refs.scroll) {
                        const el = current.value.refs.el!
                        refs.scroll.methods.scrollTop(el.offsetTop, 200)
                    }
                } else {
                    let index = showOptions.value.indexOf(current.value)
                    if (index === 0) {
                        index = showOptions.value.length - 1
                        current.value = showOptions.value[index]

                        // 滚动到高亮的选项
                        if (!!refs.scroll) {
                            const el = current.value.refs.el!
                            refs.scroll.methods.scrollTop(el.offsetTop, 200)
                        }
                    } else {
                        index--
                        current.value = showOptions.value[index]

                        // 滚动到高亮的选项
                        if (!!refs.scroll) {
                            const el = current.value.refs.el!
                            const {wrapperScrollTop} = refs.scroll.freezeState
                            if (wrapperScrollTop > el.offsetTop) {
                                refs.scroll.methods.scrollTop(el.offsetTop, 200)
                            }
                        }
                    }
                }
            },
            /**
             * 高亮下一个元素
             * @author  韦胜健
             * @date    2020/6/8 9:18
             */
            highlightNext: () => {
                if (showOptions.value.length === 0) {
                    return
                }
                if (!current.value) {
                    current.value = showOptions.value[0]
                } else {
                    let index = showOptions.value.indexOf(current.value)
                    if (index === showOptions.value.length - 1) {
                        index = 0
                        current.value = showOptions.value[index]

                        // 滚动到高亮的选项
                        if (!!refs.scroll) {
                            refs.scroll.methods.scrollTop(0, 200)
                        }
                    } else {
                        index++
                        current.value = showOptions.value[index]

                        // 滚动到高亮的选项
                        if (!!refs.scroll) {
                            const el = current.value.refs.el!
                            const {state: {hostHeight}, freezeState: {wrapperScrollTop}} = refs.scroll
                            const scrollTop = el.offsetTop + el.offsetHeight - hostHeight
                            if (scrollTop > 0 && scrollTop > wrapperScrollTop) {
                                refs.scroll.methods.scrollTop(scrollTop, 200)
                            }
                        }
                    }
                }


            },
            /**
             * 选中当前高亮的元素
             * @author  韦胜健
             * @date    2020/6/8 9:18
             */
            selectHighlight: () => {
                if (showOptions.value.length === 0) {
                    return
                }
                if (!current.value) {
                    methods.highlightNext()
                }
                if (!!current.value) {
                    handler.clickOption(current.value as any)
                }
            },
        }

        return {
            refer: {
                props,
                handler,
                methods,
                utils,
                current,
            },
            render: () => {

                const inner = <>
                    {(options.value.length === 0 || showOptions.value.length === 0) ? (
                        <div className="pl-select-panel-empty-text">
                            <PlIcon icon="el-icon-nodata"/>
                            {options.value.length === 0 ? props.noDataText : props.noMatchText}
                        </div>
                    ) : null}
                    {slots.default()}
                    {!!props.content ? ((typeof props.content === "function" ? props.content() : props.content)) : null}
                    {!!props.showDebug ? (
                        <div className="pl-select-panel-debug">
                            {options.value.map(option => <div key={option.props.val}>{option.props.label}__{option.props.val}__{option.props.disabled}</div>)}
                        </div>
                    ) : null}
                </>

                const content: any = !!props.height ? (
                    <PlScroll fitHostWidth ref={onRef.scroll}>
                        {inner}
                    </PlScroll>
                ) : inner

                return (
                    <div className={classes.value} style={styles.value}>
                        {content}
                    </div>
                )
            }
        }
    },
})

export const SelectPanelCollector = useCollect(() => ({
    parent: PlSelectPanel,
    child: PlSelectOption,
}))