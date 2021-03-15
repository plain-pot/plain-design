import {reactive} from "@vue/runtime-core";
import React from "react";
import {designComponent, useModel, useReference} from "plain-design-composition";

const Child = designComponent({
    props: {
        name: {type: String},
        age: {type: Number},
        modelValue: {type: String},
    },
    emits: {
        onUpdateModelValue: (val?: string) => true,
    },
    setup({props, event: {emit}}) {

        const inputRef = useReference<HTMLInputElement>()
        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        return {
            refer: {
                props,
                focus: () => !!inputRef.current && inputRef.current.focus()
            },
            render() {
                return (
                    <div>
                        this is child: {props.name}-{props.age}
                        <input type="text" ref={inputRef} v-model={model.value}/>
                    </div>
                )
            },
        }
    },
})

const TestUseReference = designComponent({
    setup() {
        const state = reactive({
            show: true,
        })
        const childRef = useReference<typeof Child.use.class>()
        return () => (
            <div>
                <h2>测试 useReference</h2>
                {!!state.show && <Child onRef={childRef}/>}
                <button onClick={() => console.log(childRef.current)}>log</button>
                <button onClick={() => state.show = !state.show}>show child:{String(state.show)}</button>
                <button onClick={() => !!childRef.current && childRef.current.focus()}>focus</button>
            </div>
        )
    },
})

const TestUseComponentUse = designComponent({
    setup() {
        const state = reactive({
            show: true,
        })
        const childRef = Child.use.ref()
        return () => (
            <div>
                <h2>测试组件use.ref</h2>
                {!!state.show && <Child onRef={childRef}/>}
                <button onClick={() => console.log(childRef.current)}>log</button>
                <button onClick={() => state.show = !state.show}>show child:{String(state.show)}</button>
                <button onClick={() => !!childRef.current && childRef.current.focus()}>focus</button>
            </div>
        )
    },
})

const TestLifecycle = designComponent({
    setup() {
        const state = reactive({
            show: true,
        })
        const childRef = useReference<typeof Child.use.class>()
        return () => (
            <div>
                <h2>测试组件生命周期事件</h2>

                {!!state.show && <Child
                    onRef={childRef}
                    onMounted={() => console.log('child mounted')}
                    onUpdated={() => console.log('child updated')}
                    onBeforeUnmount={() => console.log('child unmounted')}
                />}

                <button onClick={() => console.log(childRef.current)}>log</button>
                <button onClick={() => state.show = !state.show}>show child:{String(state.show)}</button>
                <button onClick={() => !!childRef.current && childRef.current.focus()}>focus</button>
            </div>
        )
    },
})

export default designComponent({
    setup() {
        return () => (
            <div>

                <TestUseReference/>
                <TestUseComponentUse/>
                <TestLifecycle/>
            </div>
        )
    },
})