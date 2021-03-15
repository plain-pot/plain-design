type RefValueType<V> = V extends { use: { ref: () => { current: infer Refer } } } ? Refer :
    V extends new (...args: any[]) => infer Refer ? Refer : V

export function useRefs<T extends { [k: string]: any }>(config: T): {
    refs: {
        [k in keyof T]: RefValueType<T[k]> | null
    },
    onRef: {
        [k in keyof T]: { current: RefValueType<T[k]> | null }
    },
} {
    return {} as any
}