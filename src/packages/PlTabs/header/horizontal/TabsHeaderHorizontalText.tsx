import {designComponent} from "plain-design-composition";
import React from "react";
import {TabCommonProps} from "../../tabs.utils";
import './tabs-header-text.scss'

export const PlTabsHeaderHorizontalText = designComponent({
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