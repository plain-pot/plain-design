import {computed, reactive, watch} from "plain-design-composition"

export function usePropsState<Props extends Record<string, any>>(propsRef: { value: Props }): Props {

    const state = reactive(Object.keys(propsRef.value).reduce((prev, propKey) => {
        prev[propKey] = undefined
        return prev
    }, {} as any))

    const propsState = reactive(Object.keys(propsRef.value).reduce((prev, propKey) => {

        watch(() => propsRef.value[propKey], () => {(propsState as any)[propKey] = null})

        ;(prev as any)[propKey] = computed({
            get() {
                if (state[propKey] !== undefined) {return state[propKey]}
                return propsRef.value[propKey]
            },
            set(val: any) {
                if (state[propKey] !== val) {
                    state[propKey] = val
                }
            },
        })
        return prev
    }, {} as Props))

    return propsState as any
}