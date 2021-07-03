import {onBeforeUnmount, onMounted, provide, reactive, ref, useRefs, useStyles} from "plain-design-composition";
import {createDefaultService} from "../PlRoot/createDefaultService";
import {nextIndex} from "plain-design-composition"
import {ReactNode} from "react";
import React from "react";
import PlTransition from "../PlTransition";
import {ClickBodyListener} from "../../utils/ClickBodyListener";

export type ContextmenuReference = MouseEvent | HTMLElement | { x: number, y: number } | Element | EventTarget | null
export type ContextContent = (() => ReactNode) | { label: string, icon?: string, disabled?: string }[]

export interface ContextmenuServiceOption {
    reference: ContextmenuReference,
    content: ContextContent,
    width?: number,
    height?: number,
    hide?: () => void,
}

export function getReferencePosition(reference: ContextmenuReference): { top: number, left: number } {
    if (!reference) {
        throw new Error('reference is null')
    }
    if ('addEventListener' in reference) {
        let el = reference
        if ('getBoundingClientRect' in el) {
            const {top, left, height} = el.getBoundingClientRect()
            return {
                top: top + height,
                left: left,
            }
        } else {
            console.log('reference', reference)
            throw new Error('getBoundingClientRect not exist in reference')
        }
    } else if ('clientX' in reference) {
        const {clientX, clientY} = reference
        return {
            top: clientY,
            left: clientX,
        }
    } else {
        return {
            top: reference.y,
            left: reference.x,
        }
    }
}

export const PlContextMenuService = createDefaultService({
    name: 'pl-contextmenu-service',
    setup(option: ContextmenuServiceOption) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })
        const isShow = ref(false)
        const isOpen = ref(false)
        const state = reactive({
            option,
            zIndex: nextIndex(),
        }) as { option: ContextmenuServiceOption, zIndex: number }

        const mounted = new Promise<void>(resolve => onMounted(resolve))
        let hideTimer: number | null = null
        let onTransitionEnd: (() => void) | null = null

        const methods = {
            service: (option: ContextmenuServiceOption) => {
                state.option = option
                methods.show()
                option.hide = () => methods.hide()
            },
            show: async () => {
                if (!!hideTimer) clearTimeout(hideTimer)
                state.zIndex = nextIndex()
                await mounted;
                isShow.value = true
                onTransitionEnd = () => {
                    isOpen.value = true
                    onTransitionEnd = null
                }
            },
            hide: () => {
                isShow.value = false
                onTransitionEnd = () => {
                    isOpen.value = false
                    onTransitionEnd = null
                }
            },
        }

        const styles = useStyles(style => {
            const {top, left} = getReferencePosition(state.option.reference)
            style.top = `${top}px`
            style.left = `${left}px`
            style.zIndex = state.zIndex
        })

        const bodyStyles = useStyles(style => {
            const {width, height} = state.option
            !!width && (style.width = `${width}px`);
            !!height && (style.height = `${height}px`);
        })

        const handler = {
            onTransitionEnd: () => !!onTransitionEnd && onTransitionEnd(),
            onMousedownWindow: (e: MouseEvent) => {
                if (!refs.el!.contains(e.target as HTMLDivElement)) {
                    hideTimer = setTimeout(() => methods.hide(), 50) as any as number
                }
            },
            clickDropdownOption: () => {
                methods.hide()
            },
        }

        onBeforeUnmount(ClickBodyListener.listen(handler.onMousedownWindow))

        provide('@@pl-dropdown', {handler})

        return {
            refer: {
                state,
                isShow,
                isOpen,
                ...methods,
            },
            render: () => {

                let content: ReactNode;
                if (typeof state.option.content === "function") {
                    content = state.option.content()
                } else {
                    content = state.option.content.map(item => <div>
                        {item.label}
                    </div>)
                }

                return (
                    <div className="pl-contextmenu-service" style={styles.value} ref={onRef.el} {...{show: String(isShow.value)} as any}>
                        <PlTransition
                            key={state.zIndex}
                            name="pl-transition-scale"
                            show={isShow.value}
                            unmount={false}
                            onEntered={handler.onTransitionEnd}
                            onExited={handler.onTransitionEnd}>
                            <div className="pl-contextmenu-service-body" style={bodyStyles.value}>
                                {content}
                            </div>
                        </PlTransition>
                    </div>
                )
            }
        }
    },
})

export type PlContextMenuServiceComponent = typeof PlContextMenuService.use.class