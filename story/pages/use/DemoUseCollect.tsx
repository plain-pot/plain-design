import {computed, useRefs, designComponent, reactive, useModel} from "plain-design-composition"
import {useClasses} from "plain-design-composition";
import React from "react";
import {useCollect} from "../../../src/use/useCollect";
import './DemoUseCollect.scss'

export const DemoUseCollectChildComponent = designComponent({
    name: 'demo-use-collect-child-component',
    props: {
        label: {type: String},
        val: {type: [String, Number]},
        modelValue: {},
        trueValue: {default: true as any},
        falseValue: {default: false as any},
    },
    slots: ['default'],
    emits: {
        onUpdateModelValue: (val: any) => true
    },
    setup({props, event, slots}) {

        const {refs, onRef} = useRefs({
            button: HTMLButtonElement
        })
        const parent = DemoUseCollector.child({injectDefaultValue: null, sort: () => refs.button!})

        const modelValue = useModel(() => props.modelValue, event.emit.onUpdateModelValue, {
            autoEmit: !parent,
            autoWatch: !parent,
        })

        const handler = {
            click: () => {
                if (!!parent) {
                    parent.handler.clickItem(props.val!)
                } else {
                    modelValue.value = isChecked.value ? props.falseValue : props.trueValue
                }
            }
        }

        const isChecked = computed(() => {
            if (!parent) {
                return modelValue.value === props.trueValue
            } else {
                return parent.utils.isChecked(props.val!)
            }
        })

        const classes = useClasses(() => [
            'demo-use-collect-child',
            {
                'demo-use-collect-child-checked': isChecked.value
            }
        ])

        return {
            refer: {
                props,
            },
            render: () => (
                <button onClick={handler.click} className={classes.value} ref={onRef.button}>
                    {slots.default(props.label)}
                </button>
            )
        }
    },
})

export const DemoUseCollectParentComponent = designComponent({
    name: 'demo-use-collect-parent-component',
    props: {
        parentName: {type: String},
        modelValue: {},
    },
    slots: ['default'],
    emits: {
        onUpdateModelValue: (val: undefined | (string | number)[]) => true
    },
    setup({props, event, slots}) {

        const children = DemoUseCollector.parent()

        const modelValue = useModel(() => props.modelValue as undefined | (string | number)[], event.emit.onUpdateModelValue)

        const utils = {
            isChecked: (val: string | number) => {
                return ((modelValue.value) || []).indexOf(val) > -1
            },
            toggleCheckAll: () => {
                if (!!modelValue.value && modelValue.value.length === children.length) {
                    modelValue.value = []
                } else {
                    modelValue.value = children.map(child => child.props.val!)
                }
            },
            checkStatus: () => {
                if (!modelValue.value || modelValue.value.length === 0) return 'uncheck'
                if (modelValue.value.length === children.length) return 'check'
                return 'minus'
            }
        }

        const handler = {
            clickItem: (val: string | number) => {
                if (!modelValue.value) {
                    return modelValue.value = [val]
                }
                const index = modelValue.value.indexOf(val)
                if (modelValue.value.indexOf(val) > -1) {
                    modelValue.value.splice(index, 1)
                } else {
                    modelValue.value.push(val)
                }
            },
        }

        const minusClass = useClasses(() => [
            'demo-use-collect-child',
            'demo-use-collect-child-minus',
            `demo-use-collect-child-minus-status-${utils.checkStatus()}`
        ])

        return {
            refer: {
                handler,
                utils,
            },
            render: () => <>
                <button className={minusClass.value}
                        onClick={utils.toggleCheckAll}>
                    ??????
                </button>
                <span>
                    {slots.default()}
                </span>
            </>
        }
    },
})

export const DemoUseCollector = useCollect(() => ({parent: DemoUseCollectParentComponent, child: DemoUseCollectChildComponent}))

export default designComponent(({
    setup() {
        const state = reactive({
            selected: [],
            showFlag: true,
            showFlag2: null,
        })
        return () => (
            <div>
                <h1>????????????</h1>
                <DemoUseCollectChildComponent v-model={state.showFlag}>
                    isShow:{String(state.showFlag)}
                </DemoUseCollectChildComponent>
                <h1>?????????</h1>
                <DemoUseCollectChildComponent v-model={state.showFlag2} trueValue={10} falseValue={20}>
                    isShow:{String(state.showFlag2)}
                </DemoUseCollectChildComponent>
                <h1>?????????</h1>
                <DemoUseCollectParentComponent v-model={state.selected}>
                    <DemoUseCollectChildComponent label="?????????" val="one"/>
                    <DemoUseCollectChildComponent label="?????????" val="two"/>
                    <DemoUseCollectChildComponent label="?????????" val="three"/>
                </DemoUseCollectParentComponent>
                <div>{JSON.stringify(state.selected)}</div>
                <DemoUseCollectParentComponent v-model={state.selected}>
                    <DemoUseCollectChildComponent label="?????????" val="one"/>
                    {!!state.showFlag && <DemoUseCollectChildComponent label="?????????" val="two"/>}
                    <DemoUseCollectChildComponent label="?????????" val="three"/>
                </DemoUseCollectParentComponent>
            </div>

        )
    },
}))