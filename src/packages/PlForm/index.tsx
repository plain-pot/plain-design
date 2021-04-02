import './form.scss'
import {computed, designComponent, onMounted, PropType, reactive, ref, useNumber, useStyles, watch} from "plain-design-composition";
import {EditProps, useEdit} from "../../use/useEdit";
import {StyleProps, useStyle} from "../../use/useStyle";
import {FormAssociateFields, formatFormRules, FormComponentRules, FormValidate, FormValidateResultMap, FormValidateTrigger, FormValidateUtils} from "./form.validate";
import {FormContentAlign, FormLabelAlign, FormValidateMode} from "./form.utils";
import {useClasses} from "plain-design-composition";
import {unit} from "plain-utils/string/unit";
import $$notice from "../$$notice";
import {debounce} from "plain-utils/utils/debounce";
import React from 'react';
import {useCollect} from "../../use/useCollect";
import {PlFormItem} from "../PlFormItem";
import {PlLoadingMask} from "../PlLoadingMask";
import {delay} from "plain-utils/utils/delay";

export const PlForm = designComponent({
    name: 'pl-form',
    props: {
        ...EditProps,
        ...StyleProps,
        disabledFields: {type: Object as PropType<Record<string, boolean>>},// 禁用的字段
        readonlyFields: {type: Object as PropType<Record<string, boolean>>},// 只读的字段

        modelValue: {type: Object},                                         // model绑定表单对象
        rules: {type: Object as PropType<FormComponentRules>},              // 表单验证规则
        validateResult: {type: Object},                                     // 校验结果信息
        validateMode: {type: String as PropType<keyof typeof FormValidateMode>, default: FormValidateMode.form},// 校验模式
        associateFields: {type: Object as PropType<FormAssociateFields>},   // 校验关联字段，一个对象，key为字段名，value为字段字符串或者字符串数组。当key变化时，会自动校验value中所列的字段

        hideRequiredAsterisk: {type: Boolean, default: null},               // 是否隐藏文本旁边的红色必填星号
        hideValidateMessage: {type: Boolean, default: null},                // 是否隐藏校验失败的信息
        validateOnRulesChange: {type: Boolean, default: null},              // 是否当rules属性改变之后立即触发一次验证

        column: {type: [String, Number], default: 1},                       // 多列表单的列数
        labelWidth: {type: [String, Number]},                               // formItem 文本宽度
        contentWidth: {type: [String, Number]},                             // formItem 内容宽度

        labelAlign: {type: String as PropType<FormLabelAlign>},             // 文本对其方式
        contentAlign: {type: String as PropType<FormContentAlign>, default: FormLabelAlign.left},// content 对齐方式
        width: {type: [String, Number], default: '100%'},                   // 表单宽度
        centerWhenSingleColumn: {type: Boolean},                            // 单列的时候会使得表单内容居中，表单文本标题不计宽度，设置该属性为true则使得文本宽度参与计算居中
        colon: {type: Boolean, default: true},                              // label的冒号
        columnGutter: {type: [Number, String], default: 16},                // 列之间的间距
        inline: {type: Boolean},                                            // 行内表单
    },
    emits: {
        /*字段值变化事件*/
        onFieldValueChange: (field: string, newVal: any, oldVal: any) => true,
    },
    inheritPropsType: HTMLDivElement,
    slots: ['default'],
    setup({props, slots, event: {emit}}) {

        /*---------------------------------------state-------------------------------------------*/

        /*收集的子组件*/
        const items = FormCollector.parent()

        useStyle();
        useEdit({adjust: data => {data.loading = false}});
        const {numberState} = useNumber(props, ['labelWidth', 'contentWidth', 'column', 'width', 'columnGutter'])

        const delayMount = (() => {
            const isMounted = ref(false)
            onMounted(async () => {
                await delay(23)
                isMounted.value = true
            })
            return isMounted
        })();

        /*---------------------------------------compute-------------------------------------------*/

        /*form-item中最大的label节点宽度*/
        const maxLabelWidth = computed(() => items.reduce((prev: number, next) => Math.max(next.state.labelWidth, prev), 0)) as { value: number }

        /*form-item所需要的对齐方式信息*/
        const align = computed(() => {
            return {
                label: props.labelAlign || (numberState.column === 1 ? FormLabelAlign.right : FormLabelAlign.left),
                content: props.contentAlign,
            }
        })

        /*form-item所需要的宽度信息*/
        const width = computed(() => {
            /*
            *  如果没有设置contentWidth
            *  如果是单列，默认contentWidth是400
            *  多了则是220
            */
            const content = !!numberState.contentWidth ? numberState.contentWidth : numberState.column === 1 ? 400 : 220
            const label = numberState.labelWidth || maxLabelWidth.value

            if (!!label) {
                return {
                    col: label + content,
                    label,
                    content,
                }
            } else {
                return {
                    content,
                }
            }
        })

        const classes = useClasses(() => [
            'pl-form',
            `pl-form-column-${numberState.column}`,
            {
                'pl-form-inline': props.inline,
            }
        ])

        /*设置form宽度*/
        const styles = useStyles((style) => {
            if (props.inline) {
                return style
            }
            style.width = unit(props.width)
        })

        /*body节点宽度。如果是单列，则左偏移 label/2 个像素，确保content在屏幕中间*/
        const bodyStyles = useStyles(style => {
            if (!delayMount.value) {
                style.opacity = '0'
            }
            if (props.inline) {
                return style
            }
            const {label, col} = width.value
            if (!label) {return}
            const {column, columnGutter} = numberState
            style.width = unit((col! + columnGutter) * column)
            style.left = `${(!props.centerWhenSingleColumn && column === 1) ? -label! / 2 : 0}px`
        })
        /*---------------------------------------validate-------------------------------------------*/

        const formValidate = computed(() => formatFormRules(props.rules, items.map(item => item.formItemComponentRules))) as { value: FormValidate }

        const loading = (() => {
            let time: null | number;
            return {
                show: () => {
                    time = setTimeout(() => {
                        childState.loading = true
                        time = null
                    }, 500) as any as number
                },
                hide: () => {
                    if (!!time) {
                        clearTimeout(time)
                    } else {
                        childState.loading = false
                    }
                },
            }
        })();

        const validateMethods = {
            validate: async (config?: { autoLoading?: boolean, autoAlert?: boolean, }) => {
                config = config || {}
                if (config.autoLoading != false) {
                    loading.show()
                }
                const {validateMessage, validateResultMap, validateResult} = await formValidate.value.methods.validate(props.modelValue!)
                loading.hide()

                childState.validateResultMap = validateResultMap
                if (!!validateMessage) {
                    if (config.autoAlert !== false) {
                        $$notice.warn(validateMessage)
                    }
                    throw {
                        validate: validateResult,
                        message: validateMessage,
                    }
                } else {
                    return null
                }
            },
            clearValidate: () => {
                childState.validateResultMap = {}
            },
            showError: (error: any) => {
                if (!!error.message) {
                    $$notice.warn(error.message)
                } else {
                    $$notice.warn(String(error))
                }
            },
        }

        /*---------------------------------------end-------------------------------------------*/

        onMounted(() => {
            // console.log('formValidate.value', formValidate.value)
        })

        const childState = reactive({
            align,
            width,
            validateResultMap: {} as FormValidateResultMap,
            loading: false,
        })

        const freezeState = {
            oldFormData: {...(props.modelValue || {})},
        }

        const validateHandler = {
            onEditChange: async (field?: string | string[]) => {
                if (props.validateMode === FormValidateMode.form) {
                    return
                }
                const fields = FormValidateUtils.getListValue(field)
                if (!fields) {return}
                await Promise.all(fields.map(f => formValidate.value.methods.validateField({
                    field: f,
                    trigger: FormValidateTrigger.change,
                    formValidateResultMap: childState.validateResultMap,
                    formData: props.modelValue || {},
                    associateFields: props.associateFields,
                })))
            },
            onBlurChange: async (field?: string | string[]) => {
                const fields = FormValidateUtils.getListValue(field)
                if (!fields) {return}
                await Promise.all(fields.map(f => formValidate.value.methods.validateField({
                    field: f,
                    trigger: FormValidateTrigger.blur,
                    formValidateResultMap: childState.validateResultMap,
                    formData: props.modelValue || {},
                    associateFields: props.associateFields,
                })))
            },
            onFieldChange: async (field: string) => {
                await formValidate.value.methods.validateField({
                    field,
                    trigger: FormValidateTrigger.change,
                    formValidateResultMap: childState.validateResultMap,
                    formData: props.modelValue || {},
                    associateFields: props.associateFields,
                })
            },
            onFormDataChange: debounce((val: any) => {
                const newFormData = val || {}
                const oldFormData = freezeState.oldFormData || {}
                const fields = Object.keys({...newFormData, ...oldFormData})

                fields.forEach(field => {
                    let newVal = newFormData[field]
                    let oldVal = oldFormData[field]
                    if (newVal !== oldVal) {
                        emit.onFieldValueChange(field, newVal, oldVal)
                        validateHandler.onFieldChange(field)
                    }
                })
                freezeState.oldFormData = {...val || {}}
            }, 150, false)
        }

        if (props.validateMode === FormValidateMode.form) {
            watch(() => props.modelValue, validateHandler.onFormDataChange, {deep: true})
        }

        return {
            refer: {
                props,
                childState,
                numberState,
                formValidate,
                validateHandler,
                ...validateMethods,
            },
            render: () => {
                return (
                    <div className={classes.value} style={styles.value}>
                        <div className="pl-form-body" style={bodyStyles.value}>
                            {slots.default()}
                        </div>
                        <PlLoadingMask modelValue={childState.loading || !!props.loading}/>
                    </div>
                )
            }
        }
    },
})

export default PlForm

export const FormCollector = useCollect(() => ({
    parent: PlForm,
    child: PlFormItem,
}))