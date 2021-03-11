import {Context, createContext, useContext} from "react";
import {useOnce} from "./hook";
import {ContextLifecycle} from "./lifecycle";

/**
 * inject函数重载类型
 * @author  韦胜健
 * @date    2021/3/9 18:05
 */
export interface Injection {
    <T = any>(key: string): T;

    <T = any>(key: string, defaultValue: T): T;
}

/**
 * inject、provide以及一些生命周期钩子函数都是通过调用TopDesign对象中的方法实现调用所在上下文的内容的
 * @author  韦胜健
 * @date    2021/3/9 18:06
 */
export const TopDesign = {
    /*setup执行过程中，设置为当前实例的变量*/
    ctx: null as null | {
        context: {
            provide: (name: string, data: any) => void,                 // 对外导出的provide执行的函数实际上是这个函数
            inject: (name: string, defaultValue?: any) => any,          // 对外导出的inject执行的函数实际上是这个函数
        },
        lifecycle: ContextLifecycle,
    }
}

/**
 * 通过name得到一个 React.createContext 对象
 * @author  韦胜健
 * @date    2021/2/25 22:26
 */
export const getContextByName = (() => {
    const map = {} as { [k: string]: Context<any> }
    return (name: string) => {
        if (!map[name]) {
            map[name] = createContext(undefined)
        }
        return map[name]
    }
})();

/**
 * 向子节点提供数据
 * @author  韦胜健
 * @date    2021/3/9 18:06
 */
export function provide(name: string, value: any) {
    if (!TopDesign.ctx) {throw new Error('只能在setup函数执行的时候执行provide函数')}
    return TopDesign.ctx.context.provide(name, value)
}

/**
 * 子节点从父节点注入数据
 * @author  韦胜健
 * @date    2021/3/9 18:06
 */
export const inject: Injection = (key: string, defaultValue?: any) => {
    if (!TopDesign.ctx) {throw new Error('只能在setup函数执行的时候执行inject函数')}
    return TopDesign.ctx.context.inject(key, defaultValue)
}

/**
 * 创建一个ctx.context，放到TopDesign.ctx.context中
 * @author  韦胜健
 * @date    2021/3/9 18:08
 */
export function createCtxContext(provideHooks: { name: string, data: any }[], inject: (name: string, defaultValue: any) => any) {
    return {
        provide: (name: string, data: any) => provideHooks.push({name, data}),
        inject: (name: string, defaultValue: any) => inject(name, defaultValue),
    }
}

/**
 * 创建一个context hook变量，给design component hook使用
 * @author  韦胜健
 * @date    2021/3/9 18:08
 */
export function createContextHooks() {
    /*存下来所有的provide hook，最后在渲染内容的时候，使用这个数组一层一层包起来*/
    const provideHooks = useOnce(() => [] as { name: string, data: any }[])
    /*存下来所有的inject hook*/
    const injectHooks = useOnce(() => {
        const hooks = [] as (() => void)[]
        return {
            inject: (name: string, defaultValue: null) => {
                const getter = (() => {
                    let count = 0
                    let value = undefined as any
                    return () => {
                        if (count === 0) {
                            // console.warn(0)
                            /*第一次执行获取值*/
                            const ctxValue = useContext(getContextByName(name))
                            if (ctxValue !== undefined) {
                                /*inject得到的值不为undefined，表示有值*/
                                value = ctxValue
                            } else {
                                if (defaultValue === undefined) {
                                    /*defaultValue为undefined表示没有默认值，表示必须inject到值。此时ctxValue为undefined表示inject不到值，这里抛出异常*/
                                    console.warn(`injection "${name}" not found.`)
                                    return undefined
                                } else {
                                    value = defaultValue
                                }
                            }
                        } else if (count === 1) {
                            /*第二次执行什么事也不做（因为实际上第一次执行和第二次是在同一次render中执行的）*/
                            // console.warn(1)
                        } else {
                            /*setup执行之后的render执行*/
                            useContext(getContextByName(name))
                            // console.warn('>1')
                        }
                        count++
                        return value
                    }
                })();
                hooks.push(getter)
                return getter()
            },
            useHook: () => {
                hooks.forEach(hook => hook())
            },
        }
    })
    return {
        provideHooks,
        injectHooks,
    }
}