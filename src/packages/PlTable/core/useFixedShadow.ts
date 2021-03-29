import {useTableGetScroll} from "./useTableGetScroll";
import {PlainScroll} from "../../PlScroll";
import {reactive} from "plain-design-composition";
import useClass from "plain-design-composition/src/use/useClasses";

export function useFixedShadow(event: {
    on: {
        onVirtualMounted: (cb: (data: { scroll: PlainScroll }) => void) => void,
    }
}) {
    const state = reactive({
        showFixedLeft: false,
        showFixedRight: false,
    })
    const freeState = {
        scroll: null as null | PlainScroll,
        onScroll: () => {
            const {freezeState: {wrapperScrollLeft}, state: {hostWidth, contentWidth}} = freeState.scroll!
            state.showFixedLeft = contentWidth > hostWidth && wrapperScrollLeft > 0
            state.showFixedRight = contentWidth > hostWidth && Math.abs(wrapperScrollLeft + hostWidth - contentWidth) > 5
        }
    }
    useTableGetScroll(event.on.onVirtualMounted, (scroll) => {
        if (!!freeState.scroll) {freeState.scroll.off.onScroll(freeState.onScroll)}
        freeState.scroll = scroll
        scroll.on.onScroll(freeState.onScroll)
        freeState.onScroll()
    })
    const classes = useClass(() => [
        {
            'plt-table-hide-fixed-left': !state.showFixedLeft,
            'plt-table-hide-fixed-right': !state.showFixedRight,
        }
    ])
    return {
        fixedShadowClass: classes,
    }
}