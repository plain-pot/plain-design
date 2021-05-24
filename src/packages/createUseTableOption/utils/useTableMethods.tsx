import {reactive, computed} from "plain-design-composition";

export function useTableAsyncMethods<Methods extends Record<string, () => Promise<{
    onSave: () => Promise<void> | void,
    onCancel: () => Promise<void> | void,
}>>>(methods: Methods) {
    const loading = (() => {
        const loading = reactive(Object.keys(methods).reduce((prev: any, methodKey) => {
            prev[methodKey] = false
            return prev
        }, {}))
        return reactive({
            ...Object.keys(methods).reduce((prev: any, methodKey) => {
                prev[methodKey] = computed({
                    get() {return loading[methodKey]},
                    set(val: boolean) {loading[methodKey] = val},
                })
                return prev
            }, {}),
            global: computed(() => Object.values(loading).every(flag => !flag))
        })
    })() as Record<keyof Methods, boolean> & Readonly<{ global: boolean }>

    return {
        loading,
    }
}