import React from "react";
import {designClassComponent, useRefs, designComponent, reactive, useModel, useReference} from "plain-design-composition";

const Child = designClassComponent({
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
                {!!state.show && <Child ref={childRef}/>}
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
                {!!state.show && <Child ref={childRef}/>}
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
                    ref={childRef}
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

const TestUseRefs = designComponent({
    setup() {

        const {refs, onRef,} = useRefs({
            input: HTMLInputElement,
            child: Child,
        })

        const state = reactive({
            show: true,
        })

        return () => (
            <div>
                <h2>测试 useRefs</h2>
                <button onClick={() => state.show = !state.show}>show</button>
                <div>
                    {!!state.show && <input type="text" ref={onRef.input}/>}
                    <button onClick={() => !!refs.input && refs.input.focus()}>input focus</button>
                    <button onClick={() => console.log(refs.input)}>input log</button>
                </div>
                <br/>
                <div>
                    {!!state.show && <Child ref={onRef.child}/>}
                    <button onClick={() => !!refs.child && refs.child.focus()}>child focus</button>
                    <button onClick={() => console.log(refs.child)}>child log</button>
                </div>
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
                <TestUseRefs/>
            </div>
        )
    },
})