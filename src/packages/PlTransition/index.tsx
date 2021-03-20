import {designClassComponent, designComponent, onMounted, PropType, useReference} from "plain-design-composition";
import React from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import {createCounter} from "plain-design-composition/src/utils/createCounter";
import {findDOMNode} from "react-dom";

const PlSwitchTransition = designComponent({
    props: {
        mode: {type: String as PropType<'out-in' | 'in-out'>, default: 'out-in'},
        name: {type: String, required: true},
    },
    emits: {
        onAfterEnter: () => true,
        onAfterLeave: () => true,
    },
    slots: ['default'],
    setup({props, slots, event: {emit}}) {

        const count = createCounter('pl_transition')

        const state = {
            key: count(),
            prevKey: '' as any,
            prevType: null as any,
        }

        return () => {
            const children = slots.default() as any
            if (!children) {
                state.key = count()
            } else {
                const {key, type} = children
                if (key !== state.prevKey || type !== state.prevType) {
                    state.key = count()
                    state.prevKey = key
                    state.prevType = type
                }
            }
            return (
                <SwitchTransition mode={props.mode}>
                    <CSSTransition
                        key={state.key} classNames={props.name}
                        addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}>
                        {children}
                    </CSSTransition>
                </SwitchTransition>
            )
        }
    },
})

const PlDisappearTransition = designClassComponent({
    props: {
        name: {type: String, required: true},
        show: {type: Boolean},
        timeout: {type: Number, default: 300},
        unmount: {type: Boolean},
    },
    slots: ['default'],
    setup({props, slots}) {

        const {
            binding,
            cssRef,
        } = (() => {
            const cssRef = useReference()
            /*隐藏的时候销毁内容*/
            if (props.unmount) return {binding: {}, cssRef}
            /*隐藏的时候不销毁内容*/
            onMounted(() => {
                /*初始化的时候就设置不可见*/
                const el = findDOMNode(cssRef.current) as any
                if (!el) return
                if (!props.show) {el.style.display = 'none'}
            });
            return {
                cssRef,
                binding: {
                    onEnter: (el: HTMLElement) => {el.style.display = ''},
                    onExited: (el: HTMLElement) => {el.style.display = 'none'},
                },
            }
        })();

        return () => (
            <CSSTransition
                {...binding}
                ref={cssRef}
                in={props.show}
                timeout={props.timeout}
                classNames={props.name}
                unmountOnExit={props.unmount}>
                {slots.default()}
            </CSSTransition>
        )
    },
})

/**
 * switch:      name,mode
 * disappear:   show,timeout,name
 * @author  韦胜健
 * @date    2021/3/19 21:44
 */
export const PlTransition: React.FC<{
    switch?: boolean,
    name: string,

    mode?: 'out-in' | 'in-out',

    show?: boolean,
    timeout?: number,
    unmount?: boolean,
}> = (props) => {
    if (props.switch) return <PlSwitchTransition {...props}/>
    else return <PlDisappearTransition {...props}/>
}

export default PlTransition