import {useLoadingMask} from "./full";

export function useLoading() {
    const mask = useLoadingMask()
    return {
        full: mask,
        bar: () => {},
    }
}