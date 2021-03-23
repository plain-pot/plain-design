import {designComponent} from "plain-design-composition";
import React from "react";
import {Transition} from 'react-transition-group'
import {addClass} from "plain-utils/dom/addClass";
import {removeClass} from "plain-utils/dom/removeClass";

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

                el.dataset.oldPaddingTop = el.style.paddingTop;
                el.dataset.oldPaddingBottom = el.style.paddingBottom;

                el.style.display = ''
                el.style.height = '0';
                el.style.paddingTop = '0';
                el.style.paddingBottom = '0';

            },
            onEntering: (el: HTMLElement) => {
                console.log('entering')
                el.dataset.oldOverflow = el.style.overflow;
                if (el.scrollHeight !== 0) {
                    el.style.height = el.scrollHeight + 'px';
                    el.style.paddingTop = el.dataset.oldPaddingTop as string;
                    el.style.paddingBottom = el.dataset.oldPaddingBottom as string;
                } else {
                    el.style.height = '';
                    el.style.paddingTop = el.dataset.oldPaddingTop as string;
                    el.style.paddingBottom = el.dataset.oldPaddingBottom as string;
                }

                el.style.overflow = 'hidden';
            },
            onEntered: (el: HTMLElement) => {
                console.log('entered')
                removeClass(el, 'pl-collapse-transition');
                el.style.height = '';
                el.style.overflow = el.dataset.oldOverflow as string;
            },
            onExit: (el: HTMLElement) => {
                console.log('exit')
                if (!el.dataset) (el as any).dataset = {};
                el.dataset.oldPaddingTop = el.style.paddingTop;
                el.dataset.oldPaddingBottom = el.style.paddingBottom;
                el.dataset.oldOverflow = el.style.overflow;
                el.style.height = el.scrollHeight + 'px';
                el.style.overflow = 'hidden';
            },
            onExiting: (el: HTMLElement) => {
                console.log('exiting')
                if (el.scrollHeight != 0) {
                    addClass(el, 'pl-collapse-transition');
                    el.style.transitionProperty = 'height'
                    el.style.height = "0";
                    el.style.paddingTop = '0';
                    el.style.paddingBottom = '0';
                }
            },
            onExited: (el: HTMLElement) => {
                console.log('exited')
                removeClass(el, 'pl-collapse-transition');
                el.style.height = '';
                el.style.overflow = el.dataset.oldOverflow as string;
                el.style.paddingTop = el.dataset.oldPaddingTop as string;
                el.style.paddingBottom = el.dataset.oldPaddingBottom as string;
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