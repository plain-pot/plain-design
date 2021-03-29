import {computed, designComponent, onMounted, PropType, useNumber, useRefs, useStyles} from "plain-design-composition";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, StyleStatus, useStyle} from "../../use/useStyle";
import {FormContentAlign, FormLabelAlign} from "../PlForm/form.utils";
import {FormComponentItemRules, FormRule, FormValidateUtils} from "../PlForm/form.validate";
import {FormCollector} from "../PlForm";
import {reactive} from "@vue/reactivity";
import useClass from "plain-design-composition/src/use/useClasses";
import {unit} from "plain-utils/string/unit";
import React from "react";

export const PlFormItem = designComponent({
    name: 'pl-form-item',
    props: {
        ...EditProps,
        ...StyleProps,

        field: {type: [String, Array] as PropType<string | string[]>},      // 绑定的属性字段名
        rules: {type: [Array, Object] as PropType<FormRule | FormRule[]>},  // 校验规则
        required: {type: Boolean},                                          // 不能为空

        label: {type: String, default: ' '},                                // 显示文本
        labelWidth: {type: [String, Number]},                               // 显示文本宽度
        column: {type: [String, Number], default: 1},                       // 多列表单的列数
        block: {type: Boolean},                                             // 占用一行
        colon: {type: Boolean, default: null},                              // label的冒号
        labelAlign: {type: String as PropType<FormLabelAlign>},             // label 对齐方式
        contentAlign: {type: String as PropType<FormContentAlign>},         // content 对齐方式
    },
    emits: {
        onBlur: () => true,
        onChange: () => true,
    },
    provideRefer: true,
    slots: ['label', 'suffix', 'default'],
    inheritPropsType: HTMLDivElement,
    setup({props, slots, event: {emit}}) {

        const form = FormCollector.child()
        const {refs} = useRefs({label: HTMLDivElement,})
        const {styleComputed} = useStyle({adjust: ret => {!!invalidate.value && (ret.status = StyleStatus.error)}})

        const handler = {
            onEditChange: () => form.validateHandler.onEditChange(props.field),
            onEditBlur: () => form.validateHandler.onBlurChange(props.field),
        }
        useEdit({
            adjust: ret => {
                ret.onChange = handler.onEditChange
                ret.onBlur = handler.onEditBlur

                if (!!form.props.disabledFields && !!props.field) {
                    const fields = FormValidateUtils.getListValue(props.field)
                    if (!!fields && !!fields.find(f => form.props.disabledFields![f])) {
                        ret.disabled = true
                    }
                }
                if (!!form.props.readonlyFields && !!props.field) {
                    const fields = FormValidateUtils.getListValue(props.field)
                    if (!!fields && !!fields.find(f => form.props.disabledFields![f])) {
                        ret.readonly = true
                    }
                }
            }
        })

        /*---------------------------------------state-------------------------------------------*/

        const {numberState} = useNumber(props, ['labelWidth', 'column'])
        const state = reactive({
            /*当前 form item的label宽度*/
            labelWidth: 0,
        })

        /*---------------------------------------computed-------------------------------------------*/

        /*是否显示冒号*/
        const colon = computed(() => props.colon == null ? form.props.colon : props.colon)
        /*label的目标宽度*/
        const labelWidth = computed(() => numberState.labelWidth || form.numberState.labelWidth)
        /*是否设置了label宽度*/
        const staticWidth = computed(() => !!labelWidth.value)
        /*是否存在label节点*/
        const hasLabel = computed(() => !!props.label || slots.label.isExist())

        const classes = useClass(() => [
            'pl-form-item',
            `pl-form-item-size-${styleComputed.value.size}`,
            `pl-form-item-label-align-${props.labelAlign || form.childState.align.label}`,
            `pl-form-item-content-align-${props.contentAlign || form.childState.align.content}`,
            {
                'pl-form-item-static-width': staticWidth.value,
                'pl-form-item-required': isRequired.value && !form.props.hideRequiredAsterisk,
                'pl-form-item-invalidate': !!invalidate.value && !form.props.hideValidateMessage,
            }
        ])
        const isBlock = computed(() => {
            const flag = !!props.block || numberState.column === form.numberState.column
            return {
                flag,
                column: flag ? form.numberState.column : numberState.column
            }
        })

        /*form-item的宽度，与下一个form-item的gutter*/
        const styles = useStyles(style => {
            if (form.props.inline) {
                return style
            }
            const {col} = form.childState.width
            const {column} = isBlock.value
            const {columnGutter} = form.numberState
            if (!!col) {
                style.width = unit((col + columnGutter) * column)
            }
            if (form.numberState.column > 1) {
                style.paddingRight = unit(form.numberState.columnGutter)
            }
        })

        /*label节点宽度，如果有设置labelWidth的话*/
        const labelStyles = useStyles(style => {
            if (form.props.inline) {
                return style
            }
            if (!!labelWidth.value) {
                style.width = unit(labelWidth.value)
            }
        })

        /*如果没有label的话，body应该占用百分百宽度，否则宽度为占用列数x列宽 - label宽度*/
        const bodyStyles = useStyles(style => {
            if (form.props.inline) {
                return style
            }
            if (!hasLabel.value) {
                style.width = '100%'
            } else {
                const {label, col} = form.childState.width
                if (!!label) {
                    const {columnGutter} = form.numberState
                    const {column} = isBlock.value
                    style.width = unit(col! * column + (column - 1) * columnGutter - label)
                }
            }
        })

        /*---------------------------------------hook-------------------------------------------*/

        /**
         * 如果没有写死labelWidth，这mounted的时候计算label节点宽度
         * @author  韦胜健
         * @date    2020/12/11 21:32
         */
        if (!staticWidth.value && hasLabel.value) {
            onMounted(() => {
                state.labelWidth = refs.label!.scrollWidth
            })
        }

        /*---------------------------------------validate-------------------------------------------*/

        const formItemComponentRules = computed((): FormComponentItemRules => ({
            label: props.label,
            field: props.field,
            required: props.required,
            rules: props.rules,
        })) as { value: FormComponentItemRules }

        /*当前是否必填校验*/
        const isRequired = computed(() => {
            const {fieldToRequired} = form.formValidate.value
            const fields = FormValidateUtils.getListValue(props.field)
            if (!fields) {
                return false
            }
            return !!fields.find(f => !!fieldToRequired[f])
        }) as { value: boolean }

        /*当前是否校验不通过*/
        const invalidate = computed(() => {
            const {validateResultMap} = form.childState
            const fields = FormValidateUtils.getListValue(props.field)
            if (!fields) {
                return null
            }
            const invalidField = fields.find(f => !!validateResultMap[f])
            return !invalidField ? null : validateResultMap[invalidField]!
        })

        return {
            refer: {
                state,
                formItemComponentRules,
            },
            render: () => (
                <div className={classes.value} style={styles.value}>
                    {(!!props.label || slots.label.isExist()) && (
                        <div className="pl-form-item-label" style={labelStyles.value} ref="label">
                            {slots.label(props.label)} {!!props.label && !!props.label.trim() && !!colon.value && ':'}
                        </div>
                    )}
                    <div className="pl-form-item-body" style={bodyStyles.value}>
                        {slots.default()}
                        {slots.suffix.isExist() && (
                            <div className="pl-form-item-suffix">
                                {slots.suffix()}
                            </div>
                        )}
                        {!!invalidate.value && !form.props.hideValidateMessage && (<div className="pl-form-item-message">
                            {invalidate.value.message}
                        </div>)}
                    </div>
                </div>
            )
        }
    },
})

export default PlFormItem