import {computed, reactive, watch} from "plain-design-composition";

export function usePropsState<PropsGetter extends () => Record<string, any>>(propsGetter: PropsGetter) {

    const initialProps = propsGetter()

    const state = reactive(Object.keys(initialProps).reduce((prev, propKey) => {
        prev[propKey] = undefined
        return prev
    }, {} as any))

    const propsState = reactive(Object.keys(initialProps).reduce((prev, propKey) => {

        watch(() => propsGetter()[propKey], () => {
            state[propKey] = undefined
        })

        prev[propKey] = computed({
            get() {
                if (state[propKey] !== undefined) { return state[propKey]}
                return propsGetter()[propKey]
            },
            set(val: any) {
                state[propKey] = val
            },
        })

        return prev

    }, {} as any))

    return propsState as ReturnType<PropsGetter>
}