import React from "react";
import {designComponent, onBeforeUnmount, onMounted, onUpdated, useReference, watch} from "plain-design-composition";
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
        show: {type: Boolean},
    },
    slots: ['default'],
    setup({props, slots}) {

        const wrapperRef = useReference()
        const freezeState = {
            el: null as null | HTMLElement,
            onEnd: null as null | (() => void),

            show: null as null | boolean,
            oldData: {
                height: '',
                overflow: '',
                display: '',
            },
        }

        const handler = {
            onTransitionEnd: () => !!freezeState.onEnd && freezeState.onEnd(),
        }

        const methods = {
            show: async (animation = true) => {
                const el = freezeState.el
                /*没有dom元素或者已经处于显示的状态，则不做处理*/
                if (!el || freezeState.show === true) {return}

                freezeState.show = true
                /*设置当前显示，以便读取scrollHeight高度*/
                el.style.display = freezeState.oldData.display == 'none' ? '' : freezeState.oldData.display
                if (animation) {
                    /*保存要被修改的值*/
                    freezeState.oldData = {
                        height: el.style.height,
                        overflow: el.style.overflow,
                        display: '',
                    }
                    const {scrollHeight} = el
                    /*动画开始的高度*/
                    el.style.height = unit(0)!;
                    el.style.overflow = 'hidden';

                    await delay(23)
                    addClass(el, 'pl-collapse-transition');
                    /*动画结束的高度*/
                    el.style.height = unit(scrollHeight)!;

                    freezeState.onEnd = () => {
                        /*动画结束之后，将值还原*/
                        el.style.height = freezeState.oldData.height;
                        el.style.overflow = freezeState.oldData.overflow;
                        removeClass(el, 'pl-collapse-transition');
                    }
                }
            },
            hide: async (animation = true) => {
                const el = freezeState.el
                /*没有dom元素或者已经处于隐藏的状态，则不做处理*/
                if (!el || freezeState.show === false) {return}
                /*当前处于隐藏的状态*/
                freezeState.show = false

                if (animation) {
                    /*记录被修改的值*/
                    freezeState.oldData = {
                        height: el.style.height,
                        overflow: el.style.overflow,
                        display: '',
                    }
                    /*动画开始的时候的高度*/
                    el.style.height = unit(el.scrollHeight)!;
                    el.style.overflow = 'hidden';
                    addClass(el, 'pl-collapse-transition');
                    await delay(23)
                    /*动画结束的高度*/
                    el.style.height = "0px";
                    freezeState.onEnd = () => {
                        /*动画结束之后，设置display：none，并且将修改过的值复原*/
                        el.style.height = freezeState.oldData.height;
                        el.style.overflow = freezeState.oldData.overflow;
                        freezeState.oldData.display = el.style.display
                        el.style.display = 'none'
                        removeClass(el, 'pl-collapse-transition');
                    }
                } else {
                    el.style.display = 'none'
                }
            },
        }

        onUpdated(() => {
            /*每次update之后，都检查一遍el是否发生了变化，是则重新添加事件*/
            const {el: oldEl} = freezeState
            const newEl = findDOMNode(wrapperRef.current) as HTMLElement
            if (oldEl === newEl) { return}
            !!oldEl && oldEl.removeEventListener('transitionend', handler.onTransitionEnd)
            !!newEl && newEl.addEventListener('transitionend', handler.onTransitionEnd)
            freezeState.el = newEl
        })

        watch(() => props.show, val => {val ? methods.show() : methods.hide()})
        onMounted(() => {props.show ? methods.show(false) : methods.hide(false)})

        return () => (
            <Wrapper ref={wrapperRef}>
                {slots.default()}
            </Wrapper>
        )
    },
})

export default PlCollapseTransition