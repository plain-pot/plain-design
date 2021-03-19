import {designComponent, PropType} from "plain-design-composition";
import React from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";
import {createCounter} from "plain-design-composition/src/utils/createCounter";

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
    else return (
        <CSSTransition
            in={props.show}
            timeout={props.timeout == null ? 300 : props.timeout}
            classNames={props.name}
            unmountOnExit={props.switch ? undefined : props.unmount}>
            {props.children}
        </CSSTransition>
    )
}

export default PlTransition