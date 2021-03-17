import {onBeforeUpdate, ref} from "plain-design-composition"

interface UseRefList {
    <T = any>(reactive: true): { value: T[] }

    <T = any>(): T[]
}

export const useRefList: UseRefList = <T>(reactive?: boolean) => {
    if (reactive) {
        const refs = ref([] as T[])
        onBeforeUpdate(() => refs.value = [])
        return refs
    } else {
        const refs = [] as any
        onBeforeUpdate(() => refs.splice(0, refs.length))
        return refs
    }
}
