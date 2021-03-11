import React, {useState} from "react"
import {reactive} from "vue";
import {designComponent, inject, PropType, provide} from "../composition";

export const PropDemo = designComponent({
    setup() {
        const state = reactive({
            username: 'admin000',
            password: '123456'
        })

        return () => (
            <div>
                <h1>prop demo</h1>
                <div>
                    普通传值：<Button label={'HELLO'}/>
                </div>
                <div>
                    {/*Boolean 错误传值<Button label/>*/}
                </div>
                <div>
                    {/*错误类型传值：<Button label={12345}/>*/}
                </div>
                <div>
                    多个类型：<Button name={12345}/>
                </div>
                <div>
                    {/*缺少required属性：<Require/>*/}
                </div>
                <div>
                    <h2>向下传值：</h2>
                    <InputParent/>
                </div>
                <div>
                    <h2>测试派发事件</h2>
                    {state.username}
                    <TestDesignInput value={state.username} onChange={val => state.username = String(val || '')}/>
                </div>
                <div>
                    <h2>测试避免不必要的render</h2>
                    <RerenderOnListenerChange/>
                </div>
                <div>
                    <ProvideReferDemo/>
                </div>
                <div>
                    <ProvideOverrideDemo/>
                </div>
            </div>
        )
    }
})

/*多个类型书prop*/
const Button = designComponent({
    props: {
        label: String,
        name: [String, Number],
    },
    setup({props}) {
        return () => <>
            <button>
                label:{props.label}
            </button>
            <button>
                name:{props.name}
            </button>
        </>
    },
})

/*必填的prop*/
const Require = designComponent({
    props: {
        label: {
            type: String,
            required: true,
        }
    },
    setup({props}) {
        return () => <>
            <button>
                label:{props.label}
            </button>
        </>
    },
})

/*向下穿值demo*/
const InputParent = (() => {

    const InputChild = designComponent({
        props: {
            value: {type: [String, Number]},
        },
        setup({props}) {
            return () => (
                <div>
                    value: <button>{props.value}</button>
                </div>
            )
        },
    })

    return designComponent({
        setup() {

            const state = reactive({
                text: 'hello world',
            })

            return () => (
                <div>
                    <input type="text" v-model={state.text}/>
                    <InputChild value={state.text}/>
                </div>
            )
        },
    })
})();

/*prop类型校验*/
const TestDesignChild = designComponent({
    props: {
        icon: {type: String},
        requiredIcon: {type: String, required: true},
        defaultIcon: {type: String, default: '123'},
        multipleType: {type: [String, Number, Boolean]},
        sayHello: {type: Function as PropType<(name: string) => void>, required: true},
    },
    setup({props}) {

        // console.log(props.icon.charAt(0))                   // 没有required以及default，值有可能是undefined
        console.log(props.requiredIcon.charAt(0))           // 有required
        console.log(props.defaultIcon.charAt(0))            // 有default
        console.log(props.multipleType)                     // 多个类型，不过没有设置required以及default
        // console.log(props.sayHello(123))                    // 函数属性

        return () => {
            return (
                <div>

                </div>
            )
        }
    },
})

/*测试类型为函数的prop*/
export const TestDesignParent: React.FC<{}> = () => {
    return (
        <div>
            <TestDesignChild requiredIcon={''} sayHello={() => {}}/>
        </div>
    )
}

/*测试emit派发事件，双向绑定值*/
export const TestDesignInput = designComponent({
    props: {
        value: {type: [String, Number]},
    },
    emits: {
        onChange: (val?: string | number) => true,
    },
    setup({props, event}) {
        return () => (
            <div>
                <input type="text" value={props.value || ''} onChange={e => event.emit.onChange(e.target.value)}/>
            </div>
        )
    },
})

/*onChange变化不会导致designComponent重新render*/
export const RerenderOnListenerChange = (() => {

    const HookDemo: React.FC<{ value: string, onChange: (val: string) => void }> = (props) => {
        console.log('hook render')
        return <input type="text" value={props.value} onChange={e => props.onChange(e.target.value)}/>
    }
    const DesignDemo = designComponent({
        props: {
            value: {type: String},
        },
        emits: {
            onChange: (val: string) => true,
        },
        setup({props, event}) {
            return {
                refer: {
                    ...props,
                    name: '',
                    age: 10,
                },
                render: () => {
                    console.log('design render')
                    return (
                        <input type="text" value={props.value} onChange={e => event.emit.onChange(e.target.value)}/>
                    )
                }
            }
        },
    })

    return () => {
        /*修改username不会导致 design demo重新render，因为 design demo的value没有变化，并且onChange不是响应式属性，不会导致design demo重新render*/
        const [username, setUsername] = useState('username')
        const [password, setPassword] = useState('password')
        return <>
            <div>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}/> normal input
            </div>
            <div>
                <HookDemo value={password} onChange={setPassword}/> hook input
            </div>
            <div>
                <DesignDemo value={password} onChange={setPassword}/> design input
            </div>
        </>
    }
})();

export const ProvideReferDemo = (() => {

    const Parent = designComponent({
        name: 'pl-parent',
        provideRefer: true,
        props: {
            text: {type: String},
        },
        slots: ['default'],
        setup({props}) {
            const state = reactive({
                username: 'parent',
                age: 100,
            })
            return {
                refer: {
                    state, props,
                },
                render: () => (
                    <>
                        <input type="text" v-model={state.username}/>
                        {props.children}
                    </>
                )
            }
        },
    })

    const Child = designComponent({
        expose: {
            sayHello: (name: string) => {},
        },
        setup() {
            const parentValue = Parent.use.inject()
            console.log('parentValue', parentValue)
            return () => (
                <div>
                    child:{JSON.stringify(parentValue.state)}
                </div>
            )
        },
    })

    // Child.sayHello(123)

    return designComponent({
        setup() {
            const state = reactive({
                text: 'text'
            })
            return () => (
                <div>
                    <h2>provideRefer</h2>
                    <input type="text" v-model={state.text}/>
                    <div>
                        parent:
                        <Parent text={state.text}>
                            <Child></Child>
                        </Parent>
                    </div>
                </div>
            )
        },
    })
})();

const ProvideOverrideDemo = (() => {

    const PROVIDE_NAME = '@@ProvideOverrideDemo'

    const Demo = designComponent({
        setup() {
            return () => {
                // console.log('demo render')
                return (
                    <div>
                        <h1>Provide变量覆盖示例</h1>
                        <A/>
                    </div>
                )
            }
        },
    })
    const A = designComponent({
        name: PROVIDE_NAME,
        provideRefer: true,
        setup() {
            const state = reactive({text: 'A initial value'})
            return {
                refer: {state},
                render: () => {
                    return (
                        <div>
                            <span style={{marginRight: '20px'}}>A</span><input type="text" v-model={state.text}/>
                            <div style={{padding: '20px'}}>
                                <B/>
                                <B/>
                                <C/>
                            </div>
                        </div>
                    )
                }
            }
        },
    })
    const B = designComponent({
        name: PROVIDE_NAME,
        provideRefer: true,
        setup() {
            const state = reactive({text: 'B initial value'})
            return {
                refer: {state},
                render: () => {
                    // console.log('B render')
                    return (
                        <div>
                            <span style={{marginRight: '20px'}}>B</span><input type="text" v-model={state.text}/>
                            <div>
                                <C/>
                            </div>
                        </div>
                    )
                },
            }
        }
    })

    const C = designComponent({
        setup() {
            const parentState = B.use.inject()
            return () => {
                // console.log('C render')
                return (<div style={{margin: '20px'}}>
                    i am C:[{parentState.state.text}]
                </div>)
            }
        },
    })

    return Demo
})();