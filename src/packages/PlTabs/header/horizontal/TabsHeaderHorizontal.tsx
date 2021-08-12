import {designComponent, onMounted, onUpdated, reactive, useClasses, useRefs, useStyles} from "plain-design-composition";
import React, {useRef} from "react";
import {TabCommonProps} from "../../tabs.utils";
import {PlTabsHeaderHorizontalText} from "./TabsHeaderHorizontalText";
import {PlTabsHeaderHorizontalCard} from "./TabsHeaderHorizontalCard";
import {PlTabsHeaderHorizontalShadow} from "./TabsHeaderHorizontalShadow";
import './tabs-header-horizontal.scss'
import PlIcon from "../../../PlIcon";
import PlButton from "../../../PlButton";

export const PlTabsHeaderHorizontal = designComponent({
    props: {
        ...TabCommonProps,
    },
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const state = reactive({
            showMoreButton: false,
            scrollLeft: 0,
            offsetWidth: 0,
            scrollWidth: 0,
        })

        const classes = useClasses(() => [
            'pl-tabs-header',
            'pl-tabs-header-horizontal',
            `pl-tabs-header-type-${props.headType}`,
            `pl-tabs-header-pos-${props.headPosition}`,
            {
                'pl-tabs-header-show-more': state.showMoreButton
            }
        ])

        const listStyles = useStyles(style => {
            if (state.showMoreButton) {
                style.left = state.scrollLeft
            }
        })

        onUpdated(() => {
            const {scrollWidth, offsetWidth} = refs.el!
            let flag = scrollWidth > offsetWidth + 20
            if (state.showMoreButton !== flag) {
                state.showMoreButton = flag
            }
            state.offsetWidth = offsetWidth
            state.scrollWidth = scrollWidth
        })

        const handler = {
            scrollLeft: () => {
                const scrollLeft = state.scrollLeft + state.offsetWidth
                state.scrollLeft = Math.min(0, scrollLeft)
            },
            scrollRight: () => {
                const scrollLeft = state.scrollLeft - state.offsetWidth
                state.scrollLeft = Math.max(-(state.scrollWidth - state.offsetWidth), scrollLeft)
            },
        }

        return () => (
            <div className={classes.value} ref={onRef.el}>
                {state.showMoreButton && (
                    <div className="pl-tabs-header-more-button pl-boxshadow">
                        <PlButton icon="el-icon-arrow-left" mode="text" onClick={handler.scrollLeft}/>
                        <PlButton icon="el-icon-arrow-right" mode="text" onClick={handler.scrollRight}/>
                    </div>
                )}
                <div className="pl-tabs-header-list" style={listStyles.value}>
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
            </div>
        )
    },
})