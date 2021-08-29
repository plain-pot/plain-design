import {designComponent, useClasses} from "plain-design-composition";
import React from "react";
import './tabs-header-vertical.scss'
import {TabCommonProps} from "../../tabs.utils";

export const PlTabsHeaderVertical = designComponent({
    props: {
        ...TabCommonProps,
    },
    slots: ['default'],
    setup({props, slots}) {

        const classes = useClasses(() => [
            'pl-tabs-header',
            'pl-tabs-header-vertical',
            `pl-tabs-header-pos-${props.headPosition}`,
        ])

        return () => (
            <div className={classes.value}>
                {slots.default()}
            </div>
        )
    },
})