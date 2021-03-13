import {designComponent} from "plain-design-composition";
import React from "react";
import './DemoRow.scss'

export const DemoRow = designComponent({
    props: {
        title: {type: String},
    },
    slots: ['default'],
    setup({props, slots}) {
        return () => (
            <div className="demo-row">
                <div className="demo-row-title">{props.title}</div>
                <div className="demo-row-content">
                    {slots.default()}
                </div>
            </div>
        )
    },
})