import React from "react";
import {designComponent, onMounted, onUpdated, useReference, watch} from "plain-design-composition";
import {findDOMNode} from "react-dom";
import {unit} from "plain-utils/string/unit";
import {addClass} from "plain-utils/dom/addClass";
import {delay} from "plain-utils/utils/delay";
import {removeClass} from "plain-utils/dom/removeClass";

class Wrapper extends React.Component<any, any> {

    constructor(props: any) {super(props)}

    render() {return this.props.children;}

}

export const PlCollapseTransition = designComponent({
    props: {
        show: {type: Boolean, default: true},
    },
    slots: ['default'],
    setup({props, slots}) {

        const wrapperRef = useReference()
        const freezeState = {
            el: null as null | HTMLElement,
            onEnd: null as null | (() => void),

            show: true,
        }

        const handler = {
            onTransitionEnd: () => !!freezeState.onEnd && freezeState.onEnd(),
        }

        const methods = {
            show: async () => {
                const el = freezeState.el
                if (!el || freezeState.show) {return}

                freezeState.show = true
                el.style.display = ''
                const {scrollHeight} = el
                el.style.height = unit(0)!;
                el.style.overflow = 'hidden';
                addClass(el, 'pl-collapse-transition');

                await delay(23)
                el.style.height = unit(scrollHeight)!;

                freezeState.onEnd = () => {
                    el.style.height = "";
                    el.style.overflow = '';
                    removeClass(el, 'pl-collapse-transition');
                }
            },
            hide: async () => {
                const el = freezeState.el
                if (!el || !freezeState.show) {return}

                freezeState.show = false
                el.style.height = unit(el.scrollHeight)!;
                el.style.overflow = 'hidden';
                addClass(el, 'pl-collapse-transition');

                await delay(23)
                el.style.height = "0px";

                freezeState.onEnd = () => {
                    el.style.height = "";
                    el.style.overflow = '';
                    el.style.display = 'none'
                    removeClass(el, 'pl-collapse-transition');
                    freezeState.show = false
                }
            },
        }

        onUpdated(() => {
            const {el: oldEl} = freezeState
            const newEl = findDOMNode(wrapperRef.current) as HTMLElement
            if (oldEl === newEl) { return}
            !!oldEl && oldEl.removeEventListener('transitionend', handler.onTransitionEnd)
            !!newEl && newEl.addEventListener('transitionend', handler.onTransitionEnd)
            freezeState.el = newEl
        })

        onMounted(() => {
            if (!props.show && !!freezeState.el) {
                methods.hide()
            }
        })

        watch(() => props.show, val => {
            val ? methods.show() : methods.hide()
        })

        return () => (
            <Wrapper ref={wrapperRef}>
                {slots.default()}
            </Wrapper>
        )
    },
})

export default PlCollapseTransition