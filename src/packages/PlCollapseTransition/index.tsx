import React from "react";
import {designComponent, onBeforeMount, onBeforeUnmount, onMounted, onUpdated, useReference, watch} from "plain-design-composition";
import {findDOMNode} from "react-dom";
import {unit} from "plain-utils/string/unit";
import {addClass} from "plain-utils/dom/addClass";
import {delay} from "plain-utils/utils/delay";
import {removeClass} from "plain-utils/dom/removeClass";

class Wrapper extends React.Component<any, any> {

    constructor(props: any) {super(props)}

    render() {return this.props.children;}

}

type CollapseElStyles = {
    height: string,
    paddingTop: string,
    paddingBottom: string,
    overflow: string,
    display: string,
    scrollHeight: number,
}

enum CollapseStatus {
    show = 'show',
    showing = 'showing',
    hide = 'hide',
    hiding = 'hiding',
}

export const PlCollapseTransition = designComponent({
    props: {
        show: {type: Boolean},
    },
    slots: ['default'],
    setup({props, slots}) {

        const wrapperRef = useReference()

        const state = {
            el: null as null | HTMLElement,
            handleTransitionEnd: null as null | (() => void),
            status: null as null | CollapseStatus,
            styles: null as null | CollapseElStyles,
        }

        const handler = {
            onTransitionEnd: () => !!state.handleTransitionEnd && state.handleTransitionEnd(),
            onUpdateEl: () => {
                /*每次update之后，都检查一遍el是否发生了变化，是则重新添加事件*/
                const {el: oldEl} = state
                const newEl = findDOMNode(wrapperRef.current) as HTMLElement
                if (oldEl === newEl) { return}
                !!oldEl && oldEl.removeEventListener('transitionend', handler.onTransitionEnd)
                !!newEl && newEl.addEventListener('transitionend', handler.onTransitionEnd)
                state.el = newEl
            },
        }

        const methods = {
            show: async (animation = true) => {
                const {el, status, styles} = state
                /*没有dom元素或者已经处于显示的状态，则不做处理*/
                if (!el || status === CollapseStatus.show || status === CollapseStatus.showing) {return}

                if (status !== CollapseStatus.hiding) {
                    /*设置当前显示，以便读取scrollHeight高度*/
                    const display = !styles ? '' : styles.display
                    el.style.display = display === 'none' ? '' : display
                    state.styles = {
                        height: el.style.height,
                        paddingTop: el.style.paddingTop,
                        paddingBottom: el.style.paddingBottom,
                        overflow: el.style.overflow,
                        display: el.style.display,
                        scrollHeight: el.scrollHeight
                    }
                } else {
                    // hiding => showing
                }

                state.handleTransitionEnd = null

                if (animation) {
                    state.status = CollapseStatus.showing
                    /*动画开始的高度*/
                    el.style.height = '0px';
                    el.style.paddingTop = '0px';
                    el.style.paddingBottom = '0px';
                    el.style.overflow = 'hidden';
                    // console.log('show setting')

                    await delay(23)
                    addClass(el, 'pl-collapse-transition');
                    const {height, scrollHeight, paddingBottom, paddingTop, overflow} = state.styles!
                    /*动画结束的高度*/
                    el.style.height = unit(height || String(scrollHeight))!;
                    el.style.paddingTop = unit(paddingTop)!;
                    el.style.paddingBottom = unit(paddingBottom)!;

                    state.handleTransitionEnd = async () => {
                        /*动画结束之后，将值还原*/
                        el.style.height = height;
                        el.style.overflow = overflow;
                        removeClass(el, 'pl-collapse-transition');
                        state.status = CollapseStatus.show
                    }
                } else {
                    const {height, paddingBottom, paddingTop, overflow} = state.styles!
                    el.style.height = height;
                    el.style.paddingTop = paddingTop;
                    el.style.paddingBottom = paddingBottom;
                    el.style.overflow = overflow;
                    state.status = CollapseStatus.show
                }
            },
            hide: async (animation = true) => {
                const {el, status} = state
                /*没有dom元素或者已经处于显示的状态，则不做处理*/
                if (!el || status === CollapseStatus.hide || status === CollapseStatus.hiding) {return}

                if (status !== CollapseStatus.showing) {
                    state.styles = {
                        height: el.style.height,
                        paddingTop: el.style.paddingTop,
                        paddingBottom: el.style.paddingBottom,
                        overflow: el.style.overflow,
                        display: el.style.display,
                        scrollHeight: el.scrollHeight
                    }
                } else {
                    // hiding => showing
                }
                state.handleTransitionEnd = null

                if (animation) {
                    state.status = CollapseStatus.hiding
                    const {height, scrollHeight, paddingTop, paddingBottom, overflow} = state.styles!
                    /*动画开始的高度*/
                    el.style.height = unit(height || String(scrollHeight))!;
                    el.style.paddingTop = unit(paddingTop)!;
                    el.style.paddingBottom = unit(paddingBottom)!;
                    el.style.overflow = 'hidden';

                    await delay(23)
                    addClass(el, 'pl-collapse-transition');

                    /*动画结束的高度*/
                    el.style.height = '0px';
                    el.style.paddingTop = '0px';
                    el.style.paddingBottom = '0px';
                    // console.log('hide setting=========================')

                    state.handleTransitionEnd = async () => {
                        /*动画结束之后，将值还原*/
                        el.style.height = height;
                        el.style.paddingTop = paddingTop;
                        el.style.paddingBottom = paddingBottom;
                        el.style.overflow = overflow;
                        el.style.display = 'none'
                        removeClass(el, 'pl-collapse-transition');
                        state.status = CollapseStatus.hide
                    }
                } else {
                    el.style.display = 'none'
                    state.status = CollapseStatus.hide
                }
            },
        }

        onUpdated(handler.onUpdateEl)

        watch(() => props.show, val => {val ? methods.show() : methods.hide()})
        onBeforeMount(() => {
            handler.onUpdateEl()
            props.show ? methods.show(false) : methods.hide(false)
        })

        return () => (
            <Wrapper ref={wrapperRef}>
                {slots.default()}
            </Wrapper>
        )
    },
})

export default PlCollapseTransition