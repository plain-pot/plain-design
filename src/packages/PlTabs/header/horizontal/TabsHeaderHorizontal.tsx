import {designComponent, useClasses} from "plain-design-composition";
import React from "react";
import {TabCommonProps} from "../../tabs.utils";
import {PlTabsHeaderHorizontalText} from "./TabsHeaderHorizontalText";
import {PlTabsHeaderHorizontalCard} from "./TabsHeaderHorizontalCard";
import {PlTabsHeaderHorizontalShadow} from "./TabsHeaderHorizontalShadow";
import './tabs-header-horizontal.scss'

export const PlTabsHeaderHorizontal = designComponent({
    props: {
        ...TabCommonProps,
    },
    slots: ['default'],
    setup({props, slots}) {

        const classes = useClasses(() => [
            'pl-tabs-header',
            'pl-tabs-header-horizontal',
            `pl-tabs-header-type-${props.headType}`,
            `pl-tabs-header-pos-${props.headPosition}`,
        ])

        return () => (
            <div className={classes.value}>
                {(() => {
                    const Type = props.headType === 'shadow' ? PlTabsHeaderHorizontalShadow :
                        props.headType === 'card' ? PlTabsHeaderHorizontalCard : PlTabsHeaderHorizontalText
                    return (
                        <Type headType={props.headType} headPosition={props.headPosition}>
                            {slots.default()}
                        </Type>
                    )
                })()}
            </div>
        )
    },
})