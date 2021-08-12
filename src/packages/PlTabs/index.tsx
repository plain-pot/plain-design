import {computed, designComponent, PropType, useModel} from "plain-design-composition";
import './tabs.scss'
import {useCollect} from "../../use/useCollect";
import PlTab from "../PlTab";
import {TabData, TabHeadPosition, TabHeadType} from "./tabs.utils";
import React from "react";
import {PlTabsInner} from "./TabsInner";
import {PlTabsHeader} from "./TabsHeader";

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
                    <div className="pl-tabs">
                        <div className="pl-tabs-collector">{slots.default()}</div>
                        <PlTabsHeader tabs={tabs.value} onClickTabHead={handler.onClickTabHeader}/>
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
