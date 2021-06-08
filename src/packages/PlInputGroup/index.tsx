import {designComponent} from "plain-design-composition";
import React from "react";
import './input-group.scss'

export const PlInputGroup = designComponent({
    props: {},
    slots: ['default'],
    setup({props, slots}) {
        return () => (
            <div className="pl-input-group">
                {slots.default()}
            </div>
        )
    },
})

export default PlInputGroup