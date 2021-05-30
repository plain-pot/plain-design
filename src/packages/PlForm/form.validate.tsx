import {RuleItem} from 'async-validator'
import {toArray} from "../../utils/toArray";

const logError = (msg: string) => {console.error(`PlForm:${msg}`)}

/**
 * 触发校验的动作类型
 * @author  韦胜健
 * @date    2021/5/30 12:27
 */
export enum FormValidateTrigger {
    change = 'change',
    blur = 'blur',
}

/**
 * 普通的对象类型
 * @author  韦胜健
 * @date    2021/5/30 12:25
 */
export type PlainObject = Record<string, any>;

/**
 * 校验器函数validator的类型
 * @author  韦胜健
 * @date    2021/5/30 12:25
 */
export type tFormRuleValidator = (val: any, row: PlainObject, rule: tFormRuleItem) => tFormRuleValidatorResult | Promise<tFormRuleValidatorResult>;

/**
 * 校验器函数validator函数的返回结果类型
 * @author  韦胜健
 * @date    2021/5/30 12:26
 */
export type tFormRuleValidatorResult = string | null | undefined | void

/**
 * 校验的结果对象类型
 * @author  韦胜健
 * @date    2021/5/30 12:27
 */
export type tFormRuleItem = Omit<RuleItem, 'required' | 'validator'> & {
    required?: boolean | tFormRuleValidator,
    validator?: tFormRuleValidator,

    trigger?: string,
    label?: string,
    field?: string | string[],
}

/**
 * PlFormItem组件，从props中获取的校验相关属性类型
 * @author  韦胜健
 * @date    2021/5/30 12:27
 */
export interface iFormItemPropRules {
    label?: string,
    field?: string | string[]
    required?: boolean | tFormRuleValidator,
    rules?: tFormRuleItem | tFormRuleItem[]
}

/**
 * PlForm组件props.rules的类型
 * @author  韦胜健
 * @date    2021/5/30 18:55
 */
export type tFormPropRules = Record<string, tFormRuleItem | tFormRuleItem[]>

/**
 * 关联校验字段
 * @author  韦胜健
 * @date    2020/12/28 12:07
 */
export type FormAssociateFields = Record<string, string | string[]>

/**
 * 根据 PlForm以及PlFormItem接收到的
 * @author  韦胜健
 * @date    2021/5/30 13:18
 */
export function getFormRuleData({formData, formProps, formItems, requiredMessage}: {
    formData: any,
    formProps: { rules?: tFormPropRules, },
    formItems: { value: { props: iFormItemPropRules }[] },
    requiredMessage: string,
}) {

    type StateRules = Omit<tFormRuleItem, 'field'> & { field: string | string[] }

    const state = {
        /*所有的校验规则*/
        stateRules: [] as StateRules[],
        /*字段转显示文本*/
        fieldToLabel: {} as Record<string, string | undefined>,
        /*用于判断字段是否必填*/
        fieldRequired: {} as Record<string, boolean | undefined>,
    }

    const utils = {
        /*判断某个字段是否有必填标识*/
        isRequired: (field?: string | string[]) => {
            if (!field) {return false}
            const fields = toArray(field)
            return fields.some(f => !!state.fieldRequired[f])
        },
        /*添加一个stateRule*/
        addStateRule: (stateRule: StateRules) => {
            state.stateRules.push(stateRule)
        },
        /*添加一个label*/
        addLabel: (field?: string | string[], label?: string) => {
            if (!field || !label) {return}
            toArray(field).forEach((f) => {
                state.fieldToLabel[f] = label
            })
        },
        /*添加一个required*/
        addRequired: (field: string | string[], required: boolean | tFormRuleValidator | undefined) => {
            toArray(field).forEach(f => {
                if (required == null) {return}
                state.fieldRequired[f] = typeof required !== "function" && !!required
            })
        }
    }

    if (!!formProps.rules) {
        Object.entries(formProps.rules).forEach(([f, r]) => {
            toArray(r!).forEach((rule) => {
                utils.addLabel(rule.field || f, rule.label)
                utils.addRequired(rule.field || f, rule.required)
                utils.addStateRule({
                    ...rule,
                    field: rule.field || f,
                })
            })
        })
    }

    formItems.value.forEach(({props: {label, field, required, rules}}) => {
        utils.addLabel(field, label)

        if (required) {
            if (!field) {
                /*如果没有field，但是设置了required，提示警告信息*/
                console.error({label, field, required, rules})
                logError('PlFormItem.props.field is required when PlForm.props.required is working!')
            } else {
                utils.addRequired(field, required)
                const requiredRule: StateRules = {
                    field,
                    validator: (val, row) => {
                        if (typeof required === "function") {return required(val, row, requiredRule)}
                        if (val == null) {return requiredMessage}
                        if (typeof val === "string" && !val.trim()) {return requiredMessage}
                        if (Array.isArray(val) && val.length === 0) {return requiredMessage}
                        return null
                    },
                }
                utils.addStateRule(requiredRule)
            }
        }
        if (rules) {
            toArray(rules).forEach(r => {
                if (!!r.label) {utils.addLabel(r.field || field, r.label)}

                if (!r.field) {
                    if (!field) {
                        /*如果没有field，但是设置了rule，提示警告信息*/
                        console.error(r)
                        logError('PlFormItem.props.field is required when PlForm.props.rules[].field is working!')
                    } else {
                        r.field = field
                        if (r.required) {utils.addRequired(r.field || field, r.required)}
                    }
                }
                !!r.field && utils.addStateRule({
                    ...r,
                    field: r.field!,
                })
            })
        }
    })

    return {
        ...state,
        utils,
    }
}

