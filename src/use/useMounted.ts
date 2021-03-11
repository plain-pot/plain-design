import {ref} from "vue"
import {onBeforeUnmount, onMounted} from "../composition";

export function useMounted() {
    const isMounted = ref(false)
    onMounted(() => isMounted.value = true)
    onBeforeUnmount(() => isMounted.value = false)
    return isMounted
}