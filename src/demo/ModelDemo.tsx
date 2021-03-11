import {computed, reactive} from "vue";
import {designComponent, inject, provide} from "../composition";
import React from "react";
import {Input, Select} from "antd";
import 'antd/dist/antd.min.css'
import {TestInput, TestModel, TestModelMore} from "../components/TestModel";

export const ModelDemo = designComponent({
    props: {},
    setup: () => {
        // 这个 setup函数只会执行一次
        console.log("setup");

        const state = reactive({
            formData: {
                username: null as null | string
            } as any
        });

        const names = computed(() => {
            console.log('names==>>')
            return `name_${state.formData.password}`
        })

        provide('hello world', names)

        return () => {

            // 这个render函数每次都会执行
            console.log("render");

            const bindFields = {
                propName: "username"
            };

            return (
                <div>
                    <h1>Model Demo</h1>
                    <ul>
                        <li>数据双向绑定示例</li>
                        <li>
                            <input type="text" v-change={state.formData.username}/>：直接绑定字段
                        </li>
                        <li>
                            <Input v-change={state.formData.username} style={{width: '200px'}}/>
                            <button>antd输入框组件</button>
                            <Select style={{width: 120}} v-change={state.formData.userType} onChange={e => console.log('select on change', e)}>
                                <Select.Option value="jack">Jack</Select.Option>
                                <Select.Option value="lucy">Lucy</Select.Option>
                                <Select.Option value="disabled" disabled>Disabled</Select.Option>
                                <Select.Option value="Yiminghe">yiminghe</Select.Option>
                            </Select>
                            <button>antd下拉选择组件</button>
                        </li>
                        <li>
                            <input type="text" v-change={state.formData["username"]}/>：通过属性名绑定字段
                        </li>
                        <li>
                            <input type="text" v-change={(state.formData as any)[bindFields.propName]}/>：动态绑定字段
                        </li>
                        <li>绑定未定义的字段，会自动响应式初始化该字段</li>
                        <li>
                            <input type="text" v-change={(state.formData as any).password}/>
                        </li>
                        <li>
                            <input type="text" v-change={(state.formData as any).password}/>
                        </li>
                        <li>
                            在使用v-model的同时还使用onChange，会合并为一个函数
                        </li>
                        <li>
                            <input type="text" v-change={state.formData.username} onChange={e => console.log(state.formData.username, e)}/>：直接绑定字段
                        </li>
                    </ul>
                    <div>{JSON.stringify(state.formData)}</div>
                    <div>
                        {JSON.stringify(names.value)}
                    </div>
                    <div>
                        <TodoItem/>
                    </div>
                    <div>
                        <TestModel v-model={state.formData.username} onChange={val => console.log('model change', val)}/>
                        <h3>测试model多值绑定_01</h3>
                        <TestModelMore v-model={state.formData.username}/>
                        <h3>测试model多值绑定_02</h3>
                        <TestModelMore range v-model-start={state.formData.username} v-model-end={state.formData.password}/>
                        <TestInput v-model={state.formData.username}/>
                    </div>
                    {/*<h3>查看本页面代码</h3>
                    <a target="_blank" href="https://gitee.com/martsforever-demo/umi-app/blob/master/src/pages/index.tsx">https://gitee.com/martsforever-demo/umi-app/blob/master/src/pages/index.tsx</a>*/}
                </div>
            );
        };
    }
})

const TodoItem = designComponent({
    props: {},
    setup: () => {

        const injectData = inject('hello world')

        return () => {
            return (<div>
                <div>
                    this is todo item
                </div>
                <div>[{JSON.stringify(injectData.value)}]</div>
            </div>)
        }
    }
})