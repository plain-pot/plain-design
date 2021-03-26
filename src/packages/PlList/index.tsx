import {designComponent, useRefs} from "plain-design-composition";
import React, {ReactElement} from "react";
import FlipMove from "react-flip-move";
import './list.scss'
import {PropType} from "plain-design-composition/src/composition/prop-type";

export const PlList = designComponent({
    props: {
        easing: {type: String, default: 'cubic-bezier(0.23, 1, 0.32, 1)'},
        duration: {type: [String, Number], default: '300ms'},
        animation: {type: String as PropType<FlipMove.AnimationProp>, default: 'accordionVertical'},
        enterAnimation: {type: String as PropType<FlipMove.AnimationProp>},
        leaveAnimation: {type: String as PropType<FlipMove.AnimationProp>},
        onStart: {type: Function as PropType<(childElement: ReactElement<any>, domNode: HTMLElement) => void>},
        onFinish: {type: Function as PropType<(childElement: ReactElement<any>, domNode: HTMLElement) => void>},
        onStartAll: {type: Function as PropType<(childElements: Array<ReactElement<any>>, domNodes: Array<HTMLElement>) => void>},
        onFinishAll: {type: Function as PropType<(childElements: Array<ReactElement<any>>, domNodes: Array<HTMLElement>) => void>},
        disableAllAnimations: {type: Boolean, default: false},
    },
    slots: ['default'],
    setup({props, slots}) {
        const {refs, onRef} = useRefs({el: HTMLDivElement})
        return {
            refer: {
                refs,
            },
            render: () => (
                <div className="pl-list" ref={onRef.el}>
                    <FlipMove
                        typeName={null}
                        easing={props.easing}
                        duration={props.duration}
                        enterAnimation={props.enterAnimation || props.animation}
                        leaveAnimation={props.leaveAnimation || props.animation}
                        onStart={props.onStart}
                        onFinish={props.onFinish}
                        onStartAll={props.onStartAll}
                        onFinishAll={props.onFinishAll}
                        disableAllAnimations={props.disableAllAnimations}
                        {...{children: slots.default()} as any}
                    />
                </div>
            )
        }
    },
})

export default PlList