import {computed} from 'vue';
import {CSSProperties} from "react";

export type StyleProperties = { [k in keyof CSSProperties]: string | number | undefined | null }

export function useStyles(
    getter: (styles: StyleProperties) => StyleProperties | void
) {
    return computed(() => {
        const style = {}
        return getter(style) || style
    })
}