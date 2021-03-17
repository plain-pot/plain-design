import {designComponent} from "plain-design-composition";
import React from "react";
import FlipMove from "react-flip-move";
import './PlList.scss'

export const PlList = designComponent({
    slots: ['default'],
    setup({slots}) {
        return () => (
            <div className="pl-list">
                <FlipMove typeName={null} {...{children: slots.default()} as any}/>
            </div>
        )
    },
})