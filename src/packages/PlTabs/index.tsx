import {classnames, computed, designComponent, PropType, useClasses, useModel} from "plain-design-composition";
import './tabs.scss'
import {useCollect} from "../../use/useCollect";
import PlTab from "../PlTab";
import {TabData, TabHeadPosition, TabHeadType} from "./tabs.utils";
import React from "react";
import {PlTabsInner} from "./TabsInner";
import {PlTabsHeader} from "./TabsHeader";
import {PlTabsHeaderHorizontal} from "./TabsHeaderHorizontal";
import {PlTabsHeaderVertical} from "./TabsHeaderVertical";

export const PlTabs = designComponent({
    props: {
        modelValue: {type: [String, Number]},
        headType: {type: String as PropType<keyof typeof TabHeadType>, default: TabHeadType.text},
        headPosition: {type: String as PropType<keyof typeof TabHeadPosition>, default: TabHeadPosition.top},
        closeable: {type: Boolean},
    },
    emits: {
        onUpdateModelValue: (val?: string | number) => true,
    },
    slots: ['default'],
    setup({props, event: {emit}, slots}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const items = TabCollector.parent()

        const tabs = computed(() => items.map((item, index) => ({
            item,
            index,
            active: (() => {
                const {val} = item.props
                if (val != null) {
                    return model.value == val
                }
                if (model.value != null) {
                    return model.value == index
                }
                return index == 0
            })(),
        })))

        const classes = useClasses(() => [
            'pl-tabs',
            `pl-tabs-head-position-${props.headPosition}`
        ])

        const handler = {
            onClickTabHeader: ({item, index, active}: TabData) => {
                const {props: {val}} = item
                if (active) {return}
                model.value = val == null ? index : val
            }
        }

        return {
            render: () => {
                return (
                    <div className={classes.value}>
                        <div className="pl-tabs-collector">{slots.default()}</div>
                        {(() => {
                            const Header = props.headPosition === 'top' || props.headPosition === 'bottom' ? PlTabsHeaderHorizontal : PlTabsHeaderVertical
                            return (
                                <Header>
                                    {tabs.value.map((tab, index) => (
                                        <div className={classnames([
                                            'pl-tabs-header-item',
                                            {'pl-tabs-header-item-active': tab.active}
                                        ])} key={index}
                                             onClick={() => handler.onClickTabHeader(tab)}>
                                            {tab.item.scopeSlots.head({active: false}, tab.item.props.title)}
                                        </div>
                                    ))}
                                </Header>
                            )
                        })()}
                        <div className="pl-tabs-body">
                            {tabs.value.map((tab, index) => (
                                <PlTabsInner item={tab.item} key={index} active={tab.active}/>
                            ))}
                        </div>
                    </div>
                )
            }
        }
    },
})

export const TabCollector = useCollect(() => ({
    parent: PlTabs,
    child: PlTab,
}))

export default PlTabs
