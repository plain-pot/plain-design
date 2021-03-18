import {designComponent, PropType} from "plain-design-composition";
import React from "react";
import {CSSTransition, SwitchTransition} from "react-transition-group";

export const PlTransition = designComponent({
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
        return () => {
            const children = slots.default() as any
            const key = children.key
            return (
                <SwitchTransition mode={props.mode}>
                    <CSSTransition
                        key={key} classNames={props.name}
                        addEndListener={(node, done) => node.addEventListener("transitionend", done, false)}>
                        {children}
                    </CSSTransition>
                </SwitchTransition>
            )
        }
    },
})

export default PlTransition