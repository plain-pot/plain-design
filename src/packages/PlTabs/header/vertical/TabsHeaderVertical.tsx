import {designComponent, useClasses} from "plain-design-composition";
import React from "react";
import './tabs-header-vertical.scss'

export const PlTabsHeaderVertical = designComponent({
    props: {},
    slots: ['default'],
    setup({props, slots}) {

        const classes = useClasses(() => [
            'pl-tabs-header',
            'pl-tabs-header-vertical',
            // `pl-tabs-header-type-${props.headType}`,
            // `pl-tabs-header-pos-${props.headPosition}`,
            {
                // 'pl-tabs-header-show-more': state.showMoreButton
            }
        ])

        return () => (
            <div className={classes.value}>
                {slots.default()}
            </div>
        )
    },
})