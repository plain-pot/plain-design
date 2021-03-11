import React from "react";
import {reactive, ref} from "vue";
import {designComponent, onBeforeUnmount, onBeforeUpdate, onMounted, onUpdated, useReference} from "../composition";

export const LifecycleDemo = () => {
    return (
        <div>
            <h2>测试声明周期钩子函数</h2>
            <TestMount/>
        </div>
    )
}

const TestMount = (() => {

    const Child = designComponent({
        setup() {

            const count = ref(0)
            const buttonRef = useReference<HTMLButtonElement>()

            onMounted(() => {
                console.log('child mounted')
            })

            onBeforeUnmount(() => {
                console.log('child onBeforeUnmount')
            })

            onBeforeUpdate(() => {
                console.log(`before updated, ${!buttonRef.current ? 'button not mounted' : buttonRef.current.innerText}`)
            })

            onUpdated(() => {
                console.log(`updated, ${!buttonRef.current ? 'button not mounted' : buttonRef.current.innerText}`)
            })

            return () => (
                <div>
                    <h4>我是Child组件</h4>
                    <button ref={buttonRef} onClick={() => count.value++}>计数器：{String(count.value)}</button>
                </div>
            )
        },
    })

    return designComponent({
        setup() {
            const state = reactive({
                showFlag: false,
            })

            return () => (
                <div>
                    <h2>测试mounted</h2>
                    <button onClick={() => state.showFlag = !state.showFlag}>show:{String(state.showFlag)}</button>
                    {!!state.showFlag && <Child/>}
                </div>
            )
        },
    })
})();