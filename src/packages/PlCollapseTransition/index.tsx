import {designComponent} from "plain-design-composition";
import React from "react";
import {Transition} from 'react-transition-group'
import {addClass} from "plain-utils/dom/addClass";
import {removeClass} from "plain-utils/dom/removeClass";
import {unit} from "plain-utils/string/unit";

const ElDataSetManager = (() => {
    const map = new WeakMap<HTMLElement, any>()
    return {
        get: (el: HTMLElement) => {
            let dataSet = map.get(el)
            if (!dataSet) {
                dataSet = {}
                map.set(el, dataSet)
            }
            return dataSet
        },
        set: (el: HTMLElement, dataSet: any) => {
            map.set(el, dataSet)
        }
    }
})();

export const PlCollapseTransition = designComponent({
    props: {
        show: {type: Boolean},
    },
    slots: ['default'],
    setup({props, slots}) {

        const handler = {
            onEnter: (el: HTMLElement) => {
                console.log('enter')
                addClass(el, 'pl-collapse-transition');
                if (!el.dataset) (el as any).dataset = {};
                el.style.display = el.dataset.oldDisplay as string

                el.dataset.oldPaddingTop = el.style.paddingTop;
                el.dataset.oldPaddingBottom = el.style.paddingBottom;
                el.dataset.oldHeight = el.style.height;
                el.dataset.oldOverflow = el.style.overflow;
                el.dataset.scrollHeight = String(el.scrollHeight);

                el.style.height = '0';
                el.style.paddingTop = '0';
                el.style.paddingBottom = '0';
                el.style.overflow = 'hidden'

            },
            onEntering: (el: HTMLElement) => {
                console.log('onEntering');
                let {oldPaddingTop, oldPaddingBottom, oldHeight, scrollHeight} = el.dataset as any
                scrollHeight = Number(scrollHeight)
                console.log('entering', scrollHeight)
                if (!!scrollHeight) {
                    el.style.height = scrollHeight + 'px';
                    el.style.paddingTop = oldPaddingTop as string;
                    el.style.paddingBottom = oldPaddingBottom as string;
                } else {
                    el.style.height = oldHeight as string;
                    el.style.paddingTop = oldPaddingTop as string;
                    el.style.paddingBottom = oldPaddingBottom as string;
                }
                // el.style.height = '100px'
                // el.style.overflow = 'hidden';
            },
            onEntered: (el: HTMLElement) => {
                console.log('entered')
                removeClass(el, 'pl-collapse-transition');
                el.style.height = el.dataset.oldHeight as string;
                el.style.overflow = el.dataset.oldOverflow as string;
            },
            onExit: (el: HTMLElement) => {
                console.log('onExit');
                const {paddingTop, paddingBottom, overflow, height, display,} = el.style
                const scrollHeight = el.scrollHeight
                ElDataSetManager.set(el, {paddingTop, paddingBottom, overflow, height, display, scrollHeight})
                el.style.height = unit(scrollHeight)!;
                el.style.overflow = 'hidden';
                addClass(el, 'pl-collapse-transition');
            },
            onExiting: (el: HTMLElement) => {
                console.log('onExiting');
                const {scrollHeight} = ElDataSetManager.get(el)
                console.log({scrollHeight})
                if (!scrollHeight) return

                el.style.height = "0px";
                el.style.paddingTop = '0px';
                el.style.paddingBottom = '0px';
            },
            onExited: (el: HTMLElement) => {
                console.log('onExited');
                removeClass(el, 'pl-collapse-transition');
                const {height, overflow, paddingTop, paddingBottom} = ElDataSetManager.get(el)
                el.style.height = height;
                el.style.overflow = overflow;
                el.style.paddingTop = paddingTop;
                el.style.paddingBottom = paddingBottom;
                el.style.display = 'none'
                // emit.onAfterLeave()
            },
        }

        return () => {
            return (
                <Transition
                    in={props.show}
                    {...handler}
                    addEndListener={(node, done) => {
                        node.addEventListener('transitionend', done)
                    }}>
                    {slots.default()}
                </Transition>
            )
        }
    },
})

export default PlCollapseTransition