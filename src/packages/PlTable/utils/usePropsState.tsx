import {computed, reactive, watch} from "plain-design-composition";

export function usePropsState<Props extends Record<string, any>>(props: Props) {

    const state = reactive(Object.keys(props).reduce((prev, propKey) => {
        prev[propKey] = undefined
        return prev
    }, {} as any))

    const propsState = reactive(Object.keys(props).reduce((prev, propKey) => {

        watch(() => props[propKey], () => {
            state[propKey] = undefined
        })

        prev[propKey] = computed({
            get() {
                if (state[propKey] !== undefined) { return state[propKey]}
                return props[propKey]
            },
            set(val: any) {
                state[propKey] = val
            },
        })

        return prev

    }, {} as any))

    return propsState as Props
}