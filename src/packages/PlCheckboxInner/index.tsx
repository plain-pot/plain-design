import {designComponent} from "plain-design-composition"
import {useClasses} from "plain-design-composition";
import React from "react";
import {CheckboxStatus} from "../../utils/constant";
import './checkbox-inner.scss'

export const PlCheckboxInner = designComponent({
    name: 'pl-checkbox-inner',
    props: {
        disabled: {type: Boolean},
        checkStatus: {type: String},
    },
    inheritPropsType: SVGElement,
    setup({props}) {

        const classes = useClasses(() => [
            'pl-checkbox-inner',
            `pl-checkbox-inner-status-${props.checkStatus}`,
            {
                'pl-checkbox-inner-disabled': props.disabled,
            }
        ])

        return {
            render: () => (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={classes.value}>
                    {props.checkStatus === CheckboxStatus.check && <polyline points="22,50 45,75 75,25" className="pl-checkbox-inner-check-polyline"/>}
                    {props.checkStatus === CheckboxStatus.minus && <rect x="15" y="15" width="70" height="70" className="pl-checkbox-inner-minus-polyline"/>}
                </svg>
            )
        }
    },
})

export default PlCheckboxInner