import {shallowReactive} from '@vue/runtime-core'

type RefValueType<V> = V extends { use: { ref: () => { current: infer Refer } } } ? Refer :
    V extends new (...args: any[]) => infer Refer ? Refer : V

export function useRefs<T extends { [k: string]: any }>(config: T): {
    refs: {
        [k in keyof T]: RefValueType<T[k]> | null
    },
    onRef: {
        [k in keyof T]: (val: RefValueType<T[k]> | null) => void
    },
} {

    const refs = shallowReactive((() => {
        const obj = {} as any
        for (let key in config) {
            obj[key] = undefined
        }
        return obj
    })())

    const onRef = (() => {
        const obj = {} as any
        for (let key in config) {
            obj[key] = (refer: any) => {refs[key] = refer}
        }
        return obj
    })()

    return {
        refs,
        onRef,
    } as any
}