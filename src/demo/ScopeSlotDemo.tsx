import {designComponent, PropType} from "../composition";
import React from "react";

export const ScopeSlotDemo = designComponent({
    setup() {
        return () => (
            <div>
                <BasicUsage/>
                <ScopeSlotByChildrenObject/>
                <ScopeSlotDefaultContent/>
                <ScopeSlotDefaultChildren/>
            </div>
        )
    },
})

export const BasicUsage = (() => {

    const List = designComponent({
        props: {
            data: {type: Array as PropType<any[]>, required: true},
        },
        scopeSlots: {
            item: (scope: { data: any, index: number }) => {},
        },
        setup({props, scopeSlots}) {
            return () => {
                console.log('render list')
                return (
                    <div>
                        this is list title:
                        <ul>
                            {props.data.map((item, index) => (
                                <li key={index}>
                                    {scopeSlots.item({data: item, index}, (
                                        <div>
                                            默认的item内容：{item}
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        },
    })

    return designComponent({
        setup() {

            const data = [
                '奶酪', '蛋糕', '春卷',
            ]

            return () => {
                console.log('render host')
                return (
                    <div>
                        <h2>基本用法:通过children对象传递</h2>
                        <List data={data}>
                            {{
                                item: ({data, index}: { data: any, index: number }) => {
                                    return (
                                        <div>
                                            自定义的item内容：{index + 1}、{data}
                                        </div>
                                    )
                                },
                            }}
                        </List>
                    </div>
                )
            }
        },
    })
})();

export const ScopeSlotByChildrenObject = (() => {

    const List = designComponent({
        props: {
            data: {type: Array as PropType<any[]>, required: true},
        },
        scopeSlots: {
            item: (scope: { data: any, index: number }) => {},
        },
        setup({props, scopeSlots}) {
            return () => {
                console.log('render list')
                return (
                    <div>
                        this is list title:
                        <ul>
                            {props.data.map((item, index) => (
                                <li key={index}>
                                    {scopeSlots.item({data: item, index}, (
                                        <div>
                                            默认的item内容：{item}
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        },
    })

    return designComponent({
        setup() {

            const data = [
                '奶酪', '蛋糕', '春卷',
            ]

            return () => {
                console.log('render host')
                return (
                    <div>
                        <h2>通过props传递</h2>
                        <List data={data} item={({data, index}: { data: any, index: number }) => {
                            return (
                                <div>
                                    自定义的item内容：{index + 1}、{data}
                                </div>
                            )
                        }}/>
                    </div>
                )
            }
        },
    })
})();

export const ScopeSlotDefaultContent = (() => {

    const List = designComponent({
        props: {
            data: {type: Array as PropType<any[]>, required: true},
        },
        scopeSlots: {
            item: (scope: { data: any, index: number }) => {},
        },
        setup({props, scopeSlots}) {
            return () => {
                console.log('render list')
                return (
                    <div>
                        this is list title:
                        <ul>
                            {props.data.map((item, index) => (
                                <li key={index}>
                                    {scopeSlots.item({data: item, index}, (
                                        <div>
                                            默认的item内容：{item}
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        },
    })

    return designComponent({
        setup() {

            const data = [
                '奶酪', '蛋糕', '春卷',
            ]

            return () => {
                console.log('render host')
                return (
                    <div>
                        <h2>默认作用域插槽内容</h2>
                        <List data={data}/>
                    </div>
                )
            }
        },
    })
})();

export const ScopeSlotDefaultChildren = (() => {

    const List = designComponent({
        props: {
            data: {type: Array as PropType<any[]>, required: true},
        },
        scopeSlots: {
            default: (scope: { data: any, index: number }) => {},
        },
        setup({props, scopeSlots}) {
            return () => {
                console.log('render list')
                return (
                    <div>
                        this is list title:
                        <ul>
                            {props.data.map((item, index) => (
                                <li key={index}>
                                    {scopeSlots.default({data: item, index}, (
                                        <div>
                                            默认的item内容：{item}
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        },
    })

    return designComponent({
        setup() {

            const data = [
                '奶酪', '蛋糕', '春卷',
            ]

            return () => {
                console.log('render host')
                return (
                    <div>
                        <h2>默认作用域插槽(给children直接传递函数)</h2>
                        <List data={data}>
                            {({data, index}: { data: any, index: number }) => (
                                <div>
                                    自定义的item内容：{index + 1}、{data}
                                </div>
                            )}
                        </List>
                        <h2>默认作用域插槽(通过props传递)</h2>
                        <List data={data} default={({data, index}: { data: any, index: number }) => (
                            <div>
                                自定义的item内容：{index + 1}、{data}
                            </div>
                        )}>
                        </List>
                    </div>
                )
            }
        },
    })
})();