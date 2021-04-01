import {designComponent} from "plain-design-composition"
import React from "react"

export const DemoLine = designComponent({
    name: 'demo-line',
    props: {
        title: {type: String},
        labelWidth: {type: String},
    },
    slots: ['default'],
    setup({props, slots}) {

        return {
            render: () => (
                <div className="demo-line">
                    {!!props.title && <div className="demo-line-title"><span>{props.title}</span></div>}
                    <div className="demo-line-content">
                        {slots.default()}
                    </div>
                </div>
            )
        }
    },
})