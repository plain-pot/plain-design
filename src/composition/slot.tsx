import React, {ReactNode, useMemo, useRef} from 'react'
import {reactive} from 'vue';
import {useOnce} from "./hook";

export type SlotProps<SlotKeys extends string, ScopeSlots extends { [k: string]: any }> = {
    [k in Exclude<SlotKeys, keyof ScopeSlots>]?: ReactNode | (() => ReactNode)
}

/**
 * 通过slotName，从props或者props.children中获取插槽内容
 * @author  韦胜健
 * @date    2021/3/8 16:08
 */
function getSlot(slotName: string, fcProps: any): ReactNode {
    /*如果props.children是数组或者react元素，表示传递默认插槽*/
    if (!!fcProps.children && (Array.isArray(fcProps.children) || !!fcProps.children.$$typeof)) {
        /*如果当前遍历是默认的插槽的话*/
        if (slotName === 'default') {
            return fcProps.children
        }
    } else if (!!fcProps[slotName]) {
        /*优先从props中找插槽内容*/
        return fcProps[slotName];
    } else if (!!fcProps.children && !!fcProps.children[slotName]) {
        /*从props.children中找插槽内容*/
        return fcProps.children[slotName];
    }
}

/**
 * 创建一个插槽函数，函数接收一个react元素。当存在插槽时渲染插槽内容，不存在时渲染参数的默认插槽内容
 * @author  韦胜健
 * @date    2021/3/8 16:09
 */
function createSlotFunc(slotName: string, fcProps: any, isExist: () => boolean) {
    const passSlot = getSlot(slotName, fcProps)
    return Object.assign((defaultSlot: ReactNode) => {
        let slot = passSlot || defaultSlot
        return typeof slot === "function" ? slot() : slot
    }, {isExist})
}

/**
 * slot的hook函数
 * @author  韦胜健
 * @date    2021/3/8 16:10
 */
export function useSetupSlots(fcProps: any, slots: string[] | undefined) {
    if (!slots || slots.length === 0) {return {setupSlots: {}}}

    /*---------------------------------------slot exist-------------------------------------------*/

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
        const fcSlots = slots.map(slotName => getSlot(slotName, fcProps))
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

    /*---------------------------------------生成setupSlot（setup中使用的slot对象）-------------------------------------------*/

    /**
     * setupSlot应该是一个不变的对象引用（非响应式对象，做成响应式的会导致render死循环）
     * @author  韦胜健
     * @date    2021/3/8 16:13
     */
    const setupSlotsRef = useRef({} as any)
    /**
     * fcSlots变化之后，执行memo更新setupSlot对象中的函数
     * @author  韦胜健
     * @date    2021/3/8 16:14
     */
    useMemo(() => {
        slots.forEach(slotName => setupSlotsRef.current[slotName] = createSlotFunc(slotName, fcProps, slotExist.isExist[slotName]))
    }, slotExist.fcSlots)
    return {setupSlots: setupSlotsRef.current}
}