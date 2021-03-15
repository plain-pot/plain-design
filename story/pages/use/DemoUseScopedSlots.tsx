import {designComponent} from 'plain-design-composition'
import React from 'react'
import {computed, reactive} from '@vue/reactivity'
import './DemoUseScopedSlots.scss'
import useClass from "plain-design-composition/src/use/useClasses";
import {delay} from "plain-utils/utils/delay";

class TreeNode {
    isExpand?: boolean
    isChecked?: boolean

    constructor(
        public data: any,
    ) {}
}

const DemoUseScopedSlotsComponent = designComponent({
    props: {
        data: {type: Array},
    },
    scopeSlots: {
        default: (scope: { node: TreeNode, index: number }) => {},
    },
    setup({props, scopeSlots}) {

        const formatData = computed(() => (props.data || []).map(item => new TreeNode(item)))

        const classes = useClass(() => [
            'demo-use-scoped-slots-components',
            {
                'demo-use-scoped-slots-components-has-default': scopeSlots.default.isExist()
            }
        ])

        return {
            render() {
                return (
                    <div className={classes.value}>
                        <h1>标题</h1>
                        <ul>
                            {formatData.value.map((node, index) => (
                                <li key={index}>
                                    {scopeSlots.default(
                                        {node, index},
                                        <div>{JSON.stringify(node.data)}</div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            },
        }
    },
})

async function getData() {
    await delay(Math.random() * 500 + 500)
    return [
        {name: '蛋糕', val: 'dangao'},
        {name: '奶茶', val: 'naicha'},
        {name: '果冻', val: 'guodong'},
        {name: '西瓜', val: 'xigua'},
    ]
}

export default designComponent({
    setup() {

        const state = reactive({
            hasScopedSlots: true,
            data: [] as any[]
        })

        getData().then(val => state.data = val)

        return () => (
            <div>
                <input type="checkbox" checked={state.hasScopedSlots} onChange={e => state.hasScopedSlots = e.target.checked} id={"hasScopedSlots"}/>
                <label htmlFor="hasScopedSlots">hasScopedSlots</label>

                <DemoUseScopedSlotsComponent data={state.data}>
                    {{
                        default: !state.hasScopedSlots ? undefined : (scope) => <>
                            <button>{scope.index}</button>
                            <button>{scope.node.data.name}</button>
                            <button>{scope.node.data.val}</button>
                        </>
                    }}
                </DemoUseScopedSlotsComponent>
            </div>
        )
    },
})
