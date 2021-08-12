import {designComponent} from "plain-design-composition";
import React from "react";

export const PlTabsHeaderHorizontal = designComponent({
    props: {},
    slots: ['default'],
    setup({props, slots}) {
        return () => (
            <div className="pl-tabs-header pl-tabs-header-horizontal">
                {slots.default()}
            </div>
        )
    },
})