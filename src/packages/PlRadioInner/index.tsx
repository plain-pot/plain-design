import {designComponent, useRefs} from "plain-design-composition"
import useClass from "plain-design-composition/src/use/useClasses";
import React from "react";
import './radio-inner.scss'

export const PlRadioInner = designComponent({
    name: 'pl-radio-inner',
    props: {
        checkStatus: {type: String},                // check,uncheck
    },
    inheritPropsType: SVGElement,
    setup({props}) {

        const {refs, onRef} = useRefs({el: SVGElement})

        const classes = useClass(() => [
            'pl-radio-inner',
            `pl-radio-inner-${props.checkStatus}`,
        ])

        return {
            refer: {refs},
            render: () => (
                <svg className={classes.value} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" ref={onRef.el}>
                    {props.checkStatus === 'check' && <circle cx="50" cy="50" r="30"/>}
                </svg>
            )
        }
    },
})

export default PlRadioInner