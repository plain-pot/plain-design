import {computed, designComponent, useModel, useNumber, useStyles} from "plain-design-composition";
import {EditProps, useEdit} from "../../use/useEdit";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import {SimpleFunction} from "plain-design-composition/src/composition/event";
import {CheckboxStatus} from "../../utils/constant";
import useClass from "plain-design-composition/src/use/useClasses";
import {unit} from "plain-utils/string/unit";
import React from "react";
import PlCheckboxInner from "../PlCheckboxInner";
import PlTransition from "../PlTransition";
import {CheckboxGroupCollector} from "../PlCheckboxGroup";
import {useClickWave} from "../../directives/ClickWave";
import {useRefs} from "../../use/useRefs";
import './checkbox.scss'
import {isis} from "../../utils/ifSlotIsString";

export const PlCheckbox = designComponent({
    name: 'pl-checkbox',
    props: {
        ...EditProps,
        ...StyleProps,

        modelValue: {},
        val: {type: [String, Number]},                              // 多选时选中值
        width: {type: [String, Number]},                            // 宽度
        trueValue: {default: true as any},                           // 选中实际值
        falseValue: {default: false as any},                         // 非选中值

        checkboxForAll: {type: Boolean},                            // 是否为 checkbox 全选按钮
        checkStatus: {type: String},                                // checkbox 自定义状态
    },
    emits: {
        onUpdateModelValue: (val: any) => true,
        onClick: (e?: MouseEvent) => true,
    },
    slots: ['label'],
    scopeSlots: {
        default: (scope: { checked: boolean, status: keyof typeof CheckboxStatus, click: SimpleFunction }) => {},
    },
    setup({props, slots, scopeSlots, event: {emit}}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})
        /*group父组件*/
        const checkboxGroup = CheckboxGroupCollector.child({injectDefaultValue: null})
        /*绑定值*/
        const modelValue = useModel(() => props.modelValue, emit.onUpdateModelValue)
        /*格式化属性值*/
        const {numberState} = useNumber(props, ['width'])

        /*可编辑控制*/
        const {editComputed} = useEdit()
        /*样式控制*/
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        /*当前组件内部变量引用*/
        const refer = {innerState: {props, editComputed}}
        /*当前选中状态*/
        const checkStatus = computed((): CheckboxStatus => {
            if (!!props.checkStatus) {
                return props.checkStatus as CheckboxStatus
            }
            if (!!checkboxGroup) {
                return checkboxGroup.utils.getCheckStatus(refer)
            } else {
                return modelValue.value === props.trueValue ? CheckboxStatus.check : CheckboxStatus.uncheck
            }
        })

        const classes = useClass(() => [
            'pl-checkbox',
            `pl-checkbox-status-${styleComputed.value.status}`,
            `pl-checkbox-size-${styleComputed.value.size}`,
            `pl-checkbox-check-status-${checkStatus.value}`,
            {'pl-checkbox-disabled': editComputed.value.disabled},
        ])

        /*当前选项宽度*/
        const targetWidth = computed(() => {
            if (!!numberState.width) return numberState.width
            if (!!checkboxGroup && !!checkboxGroup.props.itemWidth) return checkboxGroup.props.itemWidth
            return null
        })

        const styles = useStyles(style => {
            style.width = unit(targetWidth.value)
        })

        const handler = {
            clickEl: (e?: React.MouseEvent<HTMLDivElement>) => {
                if (!!e) {
                    e.stopPropagation()
                }
                emit.onClick(e?.nativeEvent)
                if (!editComputed.value.editable || props.customReadonly) {
                    return
                }
                if (!!checkboxGroup) {
                    return checkboxGroup.handler.clickCheckbox(refer)
                }
                modelValue.value = checkStatus.value === CheckboxStatus.check ? props.falseValue : props.trueValue

                if (!!e) {
                    e.stopPropagation()
                    e.preventDefault()
                }
            }
        }

        useClickWave({elGetter: () => refs.el, optionsGetter: () => ({size: 'large', disabled: !editComputed.value.editable}),})

        return {
            refer,
            render: () => scopeSlots.default(
                {
                    checked: checkStatus.value === CheckboxStatus.check,
                    status: checkStatus.value,
                    click: handler.clickEl,
                },
                (
                    <div className={classes.value}
                         style={styles.value}
                         onClick={handler.clickEl}
                         ref={onRef.el}>
                        <span className="plain-click-node">
                            <PlTransition switch name="pl-transition-scale">
                                <PlCheckboxInner
                                    checkStatus={checkStatus.value}
                                    key={checkStatus.value}
                                    disabled={editComputed.value.disabled!}/>
                            </PlTransition>
                        </span>
                        {isis(slots.label, label => <span className="pl-checkbox-label">{label}</span>)}
                    </div>
                ))
        }
    },
})