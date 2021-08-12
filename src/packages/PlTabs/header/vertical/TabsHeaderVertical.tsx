import {designComponent} from "plain-design-composition";
import React from "react";

export const PlTabsHeaderVertical = designComponent({
    props: {},
    slots: ['default'],
    setup({props, slots}) {
        return () => (
            <div className="pl-tabs-header vertical">
                {slots.default()}
            </div>
        )
    },
})