import {designComponent, useClasses} from "../composition";
import React from 'react';
import './SlotDemo.css'
import {reactive} from "vue";

export const SlotDemo = designComponent({
    setup() {
        return () => (
            <div>
                <NoSlotDemo/>
                <NamedSlot/>
                <DynamicClassBySlot/>
                <DynamicClassBySlot2/>
                <SlotInChild/>
            </div>
        )
    },
})


const NoSlotDemo = (() => {
    const Parent = designComponent({
        slots: ['default',],
        setup({slots}) {
            return () => {
                return (
                    <div>
                        this is parent
                        {slots.default()}
                    </div>
                )
            }
        },
    })
    const Child = designComponent({
        setup() {
            return () => (
                <div>
                    this is child
                </div>
            )
        },
    })

    return () => (
        <div>
            <h2>默认插槽</h2>
            <h3># 通过children对象的方式传递</h3>
            <Parent>
                {{default: <Child/>}}
            </Parent>
            <h3># 通过children的React元素传递</h3>
            <Parent>
                <Child/>
            </Parent>
            <h3># props.default传递</h3>
            <Parent default={<Child/>}/>
            <h3># props.children 传递</h3>
            <Parent children={<Child/>}/>
        </div>
    )
})();

const NamedSlot = (() => {

    const Parent = designComponent({
        slots: [
            'prepend', 'append'
        ],
        setup({slots}) {
            return () => {
                // console.log(slots.prepend())
                return (
                    <div>
                        {slots.prepend('默认的前置插槽内容')}
                        <div>组件内置内容</div>
                        {slots.append('默认的后置插槽内容')}
                    </div>
                )
            }
        },
    })

    return designComponent({
        setup() {
            return () => (
                <div>
                    <h2># 具名插槽</h2>
                    <h3>有自定义的插槽内容</h3>
                    <Parent>
                        {{
                            prepend: (<div>
                                自定义前置插槽内容
                            </div>),
                            append: (<div>
                                自定义后置插槽内容
                            </div>),
                        }}
                    </Parent>
                    <h3>没有自定义插槽内容</h3>
                    <Parent/>
                    <h3>自定义插槽内容通过props传递</h3>
                    <Parent prepend={(
                        <div>
                            自定义前置插槽内容 <button>btn</button>
                        </div>
                    )}/>
                </div>
            )
        }
    })
})();

const DynamicClassBySlot = (() => {

    const Parent = designComponent({
        slots: [
            'prepend',
            'append',
        ],
        setup({slots}) {

            const state = reactive({
                text: 'hello'
            })

            const classes = useClasses(() => [
                'demo-dynamic-class-by-slot',
                {
                    'demo-dynamic-class-by-slot-has-prepend': slots.prepend.isExist(),
                }
            ])

            return () => {
                console.log('render component')
                return (
                    <div className={classes.value}>
                        {slots.prepend('默认前置')}
                        <button>默认内容:{state.text}</button>
                        <input type="text" v-model={state.text}/>
                        {slots.append('默认后置')}
                    </div>
                )
            }
        },
    })

    return designComponent({
        setup() {
            const state = reactive({
                flag: false
            })
            return () => {
                console.log('render host')
                return (
                    <div>
                        <h2>根据插槽动态显示class或者其他内容</h2>
                        <button onClick={() => state.flag = !state.flag}>flag:{String(state.flag)}</button>
                        <Parent>
                            {{
                                prepend: state.flag && <div>
                                    自定义的prepend插槽
                                </div>
                            }}
                        </Parent>
                    </div>
                )
            }
        },
    })
})();

const DynamicClassBySlot2 = (() => {

    const Parent = designComponent({
        props: {
            password: {type: String}
        },
        slots: [
            'prepend',
            'append',
        ],
        setup({props, slots}) {

            const state = reactive({
                text: 'hello'
            })

            return () => {
                console.log('render component')
                return (
                    <div>
                        {slots.prepend('默认前置')}
                        <button>password:{props.password}</button>
                        <button>默认内容:{state.text}</button>
                        <input type="text" v-model={state.text}/>
                        {slots.append('默认后置')}
                    </div>
                )
            }
        },
    })

    return designComponent({
        setup() {
            const state = reactive({
                username: 'username',
                password: 'password'
            })
            return () => {
                console.log('render host')
                return (
                    <div>
                        <h2>子组件接收插槽，但是父组件没有传递插槽。这种情况相当于子组件不接受插槽，根据setupRender所依赖的变量重新render</h2>
                        <input type="text" v-model={state.username}/>
                        <input type="text" v-model={state.password}/>
                        <Parent password={state.password}/>
                    </div>
                )
            }
        },
    })
})();

const SlotInChild = (() => {
    const Child = designComponent({
        slots: ['default'],
        setup({slots}) {
            return () => {
                console.log('render component')
                return (
                    <div>
                        this is child
                        {slots.default()}
                    </div>
                )
            }
        },
    })

    return designComponent({
        setup() {
            const state = reactive({
                text: 'hello world'
            })
            return () => {
                console.log('render host')
                return (
                    <div>
                        <h2>子组件仅接收插槽，父组件传递插槽，并且插槽中依赖响应式变量</h2>
                        <Child>
                            <input type="text" v-model={state.text}/>
                            <button>{state.text}</button>
                        </Child>
                    </div>
                )
            }
        },
    })
})();
