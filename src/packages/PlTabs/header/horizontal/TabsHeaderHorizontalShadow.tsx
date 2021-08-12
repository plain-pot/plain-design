import {designComponent} from "plain-design-composition";
import React from "react";
import {TabCommonProps} from "../../tabs.utils";
import './tabs-header-shadow.scss'

export const PlTabsHeaderHorizontalShadow = designComponent({
    props: {
        ...TabCommonProps,
    },
    slots: ['default'],
    setup({props, slots}) {
        return () => <>
            <div className="pl-tabs-header-list">
                {slots.default()}
            </div>
        </>
    },
})