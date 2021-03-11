import React, {ReactNode, useMemo, useRef} from "react";
import {useOnce} from "./hook";
import {reactive} from "vue";

export type ScopeSlotProps<SlotKeys extends string, ScopeSlots extends { [k: string]: (scope: any) => any }> = {
    [k in Exclude<keyof ScopeSlots, SlotKeys>]?: (scope: Parameters<ScopeSlots[k]>[0]) => ReactNode
}

/*const scopeSlots = {item: (scope: { data: any, index: number }) => {},}
type ScopeSlot = typeof scopeSlots
type SlotKeys = ''
type A = Omit<ScopeSlotProps<SlotKeys, ScopeSlot>, ''>*/

// type C = never | number

function getScopeSlotFunc(slotName: string, fcProps: any) {
    /*如果props.children是数组或者react元素，表示传递默认作用域插槽函数*/
    if (typeof fcProps.children === "function") {
        /*如果当前遍历是默认的插槽的话*/
        if (slotName === 'default') {
            return fcProps.children
        }
    } else if (!!fcProps[slotName]) {
        /*优先从props中找作用域插槽函数*/
        return fcProps[slotName];
    } else if (!!fcProps.children && !!fcProps.children[slotName]) {
        /*从props.children中找作用域插槽函数*/
        return fcProps.children[slotName];
    }
}

function createScopeSlotFunc(slotName: string, fcProps: any, isExist: any) {
    const passSlotFunc = getScopeSlotFunc(slotName, fcProps)
    return Object.assign((scope: any, defaultSlot: ReactNode) => {
        if (!!passSlotFunc) return passSlotFunc(scope)
        else return defaultSlot
    }, {isExist})
}

export function useSetupScopeSlot(fcProps: any, scopeSlot?: object) {
    if (!scopeSlot) return {scopeSlot: {}}

    /*---------------------------------------slot exist-------------------------------------------*/
    const slots = Object.keys(scopeSlot)

    const slotExist = (() => {
        /**
         * exist是一个响应式对象，并且对象引用一直不变
         * @author  韦胜健
         * @date    2021/3/8 16:11
         */
        const exist = useOnce(() => reactive((slots).reduce((prev, slotName) => (prev[slotName] = false, prev), {} as Record<string, boolean>)))
        /**
         * 生成每个slot是否存在的函数持久引用
         * @author  韦胜健
         * @date    2021/3/8 16:11
         */
        const isExist = useOnce(() => (slots).reduce((prev, slotName) => (prev[slotName] = () => exist[slotName], prev), {} as Record<string, () => boolean>))
        /**
         * 依赖，用于useMemo
         * @author  韦胜健
         * @date    2021/3/8 16:11
         */
        const fcSlots = slots.map(slotName => getScopeSlotFunc(slotName, fcProps))
        /**
         * 当slot变化，更新响应式对象exist
         * @author  韦胜健
         * @date    2021/3/8 16:12
         */
        useMemo(() => slots.forEach((slotName, index) => {
            const flag = !!fcSlots[index]
            if (exist[slotName] !== flag) { exist[slotName] = flag}
        }), fcSlots)

        return {
            isExist,
            fcSlots,
        }
    })();

    /*---------------------------------------生成setupScopeSlot（setup中使用的scopeSlot对象）-------------------------------------------*/

    /**
     * setupScopeSlot应该是一个不变的对象引用（非响应式对象，做成响应式的会导致render死循环）
     * @author  韦胜健
     * @date    2021/3/8 16:13
     */
    const setupScopeSlotsRef = useRef({} as any)
    /**
     * fcSlots变化之后，执行memo更新setupScopeSlot对象中的函数
     * @author  韦胜健
     * @date    2021/3/8 16:14
     */
    useMemo(() => {
        slots.forEach(slotName => setupScopeSlotsRef.current[slotName] = createScopeSlotFunc(slotName, fcProps, slotExist.isExist[slotName]))
    }, slotExist.fcSlots)
    return {setupScopeSlot: setupScopeSlotsRef.current}
}