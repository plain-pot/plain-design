import {designComponent, reactive, useRefs, watch} from "plain-design-composition";
import React, {useRef} from "react";
import './TestGroupTransition.scss'
import {PlButton} from "../../../src/packages/PlButton";
import PlCollapseTransition from "../../../src/packages/PlCollapseTransition";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import {unit} from "plain-utils/string/unit";
import {addClass} from "plain-utils/dom/addClass";
import {delay} from "plain-utils/utils/delay";
import {removeClass} from "plain-utils/dom/removeClass";
import {SimpleFunction} from "plain-design-composition/src/composition/event";

export default designComponent({
    setup() {

        const state = reactive({
            show: true,
        })
        const {refs, onRef} = useRefs({
            el: HTMLElement,
        })

        let onEnd: (el: HTMLElement) => void;
        const handler = {
            onElTransitionEnd: (e: TransitionEvent) => {
                !!onEnd && onEnd(e.currentTarget as HTMLElement)
            }
        }

        watch(() => refs.el, async (el, oldEl) => {
            await delay()
            !!oldEl && oldEl.removeEventListener('transitionend', handler.onElTransitionEnd)
            !!el && el.addEventListener('transitionend', handler.onElTransitionEnd)
        }, {immediate: true})

        const hide = async () => {
            const el = refs.el!
            el.style.height = unit(el.scrollHeight)!;
            el.style.overflow = 'hidden';
            addClass(el, 'pl-collapse-transition');

            await delay(23)
            el.style.height = "0px";


            onEnd = () => {
                el.style.height = "";
                el.style.overflow = '';
                el.style.display = 'none'
                removeClass(el, 'pl-collapse-transition');
            }
        }

        const show = async () => {
            const el = refs.el!
            el.style.display = ''
            const {scrollHeight} = el
            el.style.height = unit(0)!;
            el.style.overflow = 'hidden';
            addClass(el, 'pl-collapse-transition');

            await delay(23)
            el.style.height = unit(scrollHeight)!;

            onEnd = () => {
                el.style.height = "";
                el.style.overflow = '';
                removeClass(el, 'pl-collapse-transition');
            }
        }

        return () => (
            <div>
                <h1>测试队列动画</h1>
                <PlButton label={state.show ? 'hide' : 'show'} onClick={() => state.show = !state.show}/>
                <PlButtonGroup>
                    <PlButton label={'hide'} onClick={hide}/>
                    <PlButton label={'show'} onClick={show}/>
                </PlButtonGroup>
                <PlCollapseTransition show={state.show}>
                    <div ref={onRef.el}>
                        <div style={{height: '300px', color: 'white', backgroundColor: 'blueviolet'}}>
                            this is content
                        </div>
                    </div>
                </PlCollapseTransition>
                <button>next</button>
            </div>
        )
    },
})