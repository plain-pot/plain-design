import Schema, {RuleItem} from 'async-validator'

/**
 * 校验触发动作类型
 * @author  韦胜健
 * @date    2020/12/12 15:41
 */

/**
 * 校验触发器类型
 * @author  韦胜健
 * @date    2020/12/12 22:02
 */
import {toArray} from "../../utils/toArray";

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
    required?: boolean,
    rules?: tFormRuleItem | tFormRuleItem[]
}

export type tFormPropRules = Record<string, tFormRuleItem | tFormRuleItem[]>

/**
 * 关联校验字段
 * @author  韦胜健
 * @date    2020/12/28 12:07
 */
export type FormAssociateFields = Record<string, string | string[]>

