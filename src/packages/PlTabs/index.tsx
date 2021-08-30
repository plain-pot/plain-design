import {classnames, computed, designComponent, useClasses, useModel, watch} from "plain-design-composition";
import './tabs.scss'
import {useCollect} from "../../use/useCollect";
import PlTab from "../PlTab";
import {TabCommonProps, TabData} from "./tabs.utils";
import React from "react";
import {PlTabsInner} from "./TabsInner";
import {PlTabsHeaderHorizontal} from "./header/horizontal/TabsHeaderHorizontal";
import {PlTabsHeaderVertical} from "./header/vertical/TabsHeaderVertical";
import PlIcon from "../PlIcon";

export const PlTabs = designComponent({
    props: {
        modelValue: {type: [String, Number]},
        closeable: {type: Boolean},
        ...TabCommonProps,
    },
    emits: {
        onUpdateModelValue: (val?: string | number) => true,
    },
    slots: ['default', 'operator'],
    setup({props, event: {emit}, slots}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)
        const items = TabCollector.parent()

        const tabs = computed(() => items.map((item, index) => {
            const {val} = item.props
            return {
                item,
                index,
                val: val == null ? index : val,
                active: (() => {
                    if (val != null) {
                        return model.value == val
                    }
                    if (model.value != null) {
                        return model.value == index
                    }
                    return index == 0
                })(),
            }
        }))

        watch(() => tabs.value.map(i => i.val).join('_'), () => {
            const activeItem = tabs.value.find(i => i.active)
            if (!activeItem) {
                model.value = tabs.value[0]?.val
            }
        })

        const classes = useClasses(() => [
            'pl-tabs',
            `pl-tabs-head-position-${props.headPosition}`,
            `pl-tabs-head-type-${props.headType}`,
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

                const head = (() => {
                    const Header = props.headPosition === 'top' || props.headPosition === 'bottom' ? PlTabsHeaderHorizontal : PlTabsHeaderVertical
                    return (
                        <Header headType={props.headType} headPosition={props.headPosition}>
                            {tabs.value.map((tab, index) => (
                                <div className={classnames([
                                    'pl-tabs-header-item',
                                    {'pl-tabs-header-item-active': tab.active}
                                ])} key={index}
                                     onClick={() => handler.onClickTabHeader(tab)} data-active={tab.active ? 1 : 0}>
                                    <span>{tab.item.scopeSlots.head({active: false}, tab.item.props.title)}</span>
                                    {props.closeable && <PlIcon icon="el-icon-close" onClick={e => {
                                        e.stopPropagation()
                                        tab.item.event.emit.onClose()
                                    }}/>}
                                </div>
                            ))}
                            {slots.operator.isExist() && (
                                <div className="pl-tabs-header-item-operator">
                                    {slots.operator()}
                                </div>
                            )}
                        </Header>
                    )
                })()
                const body = (
                    <div className="pl-tabs-body">
                        {tabs.value.sort((a, b) => String(a.val).localeCompare(String(b.val))).map((tab, index) => (
                            <PlTabsInner item={tab.item} key={index} active={tab.active}/>
                        ))}
                    </div>
                )

                return (
                    <div className={classes.value}>
                        <div className="pl-tabs-collector">{slots.default()}</div>
                        {props.headPosition === 'top' || props.headPosition === 'left' ? <>
                            {head}
                            {body}
                        </> : <>
                            {body}
                            {head}
                        </>}
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
