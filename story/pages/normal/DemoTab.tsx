import {designPage, reactive} from "plain-design-composition";
import React from "react";
import {PlRadioGroup, PlRadio, PlInput, PlTab, PlTabs} from "../../../src";
import {DemoRow} from "../../components/DemoRow";
import {createRpcReturn} from "fork-ts-checker-webpack-plugin/lib/rpc";
import {DemoLine} from "../../components/DemoLine";

export const DemoBasic = designPage(() => {
    return () => (
        <DemoRow title="基本用法">
            <PlTabs headType="text">
                <PlTab title="用户管理">
                    <div style={{height: '100px', padding: '20px 0'}}>
                        用户管理：
                        <PlInput onMounted={() => console.log('111 mounted')}/>
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', padding: '20px 0'}}>
                        配置管理：
                        <PlInput onMounted={() => console.log('222 mounted')}/>
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px', padding: '20px 0'}}>
                        数据集管理：
                        <PlInput onMounted={() => console.log('333 mounted')}/>
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const DemoDirection = designPage(() => {
    const state = reactive({
        position: 'top'
    })

    return () => (
        <DemoRow title="方向">
            <DemoLine>
                <PlRadioGroup v-model={state.position}>
                    <PlRadio val="top" label="top"/>
                    <PlRadio val="bottom" label="bottom"/>
                    <PlRadio val="left" label="left"/>
                    <PlRadio val="right" label="right"/>
                </PlRadioGroup>
            </DemoLine>
            <PlTabs headPosition={state.position as any}>
                <PlTab title="用户管理">
                    <div style={{height: '100px', padding: '20px 0'}}>
                        用户管理：
                        <PlInput onMounted={() => console.log('111 mounted')}/>
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', padding: '20px 0'}}>
                        配置管理：
                        <PlInput onMounted={() => console.log('222 mounted')}/>
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px', padding: '20px 0'}}>
                        数据集管理：
                        <PlInput onMounted={() => console.log('333 mounted')}/>
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const DemoHeadType = designPage(() => {
    const state = reactive({
        position: 'top',
        headType: 'text',
    })

    return () => (
        <DemoRow title="页签类型">
            <DemoLine>
                <PlRadioGroup v-model={state.position}>
                    <PlRadio val="top" label="top"/>
                    <PlRadio val="bottom" label="bottom"/>
                    <PlRadio val="left" label="left"/>
                    <PlRadio val="right" label="right"/>
                </PlRadioGroup>
            </DemoLine>
            <DemoLine>
                <PlRadioGroup v-model={state.headType}>
                    <PlRadio val="text" label="text"/>
                    <PlRadio val="card" label="card"/>
                    <PlRadio val="shadow" label="shadow"/>
                </PlRadioGroup>
            </DemoLine>
            <PlTabs headPosition={state.position as any} headType={state.headType as any}>
                <PlTab title="用户管理">
                    <div style={{height: '100px', padding: '20px 0'}}>
                        用户管理：
                        <PlInput onMounted={() => console.log('111 mounted')}/>
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', padding: '20px 0'}}>
                        配置管理：
                        <PlInput onMounted={() => console.log('222 mounted')}/>
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px', padding: '20px 0'}}>
                        数据集管理：
                        <PlInput onMounted={() => console.log('333 mounted')}/>
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const DemoLongTabs = designPage(() => {

    const state = reactive({
        position: 'top',
        headType: 'text',
    })

    return () => (
        <DemoRow title="超长页签">
            <DemoLine>
                <PlRadioGroup v-model={state.position}>
                    <PlRadio val="top" label="top"/>
                    <PlRadio val="bottom" label="bottom"/>
                    <PlRadio val="left" label="left"/>
                    <PlRadio val="right" label="right"/>
                </PlRadioGroup>
            </DemoLine>
            <DemoLine>
                <PlRadioGroup v-model={state.headType}>
                    <PlRadio val="text" label="text"/>
                    <PlRadio val="card" label="card"/>
                    <PlRadio val="shadow" label="shadow"/>
                </PlRadioGroup>
            </DemoLine>
            <PlTabs headPosition={state.position as any} headType={state.headType as any}>
                {new Array(10).fill(0).map((_, index) => (
                    <React.Fragment key={index}>
                        <PlTab title={`用户管理_${index}`}>
                            <div style={{height: '100px', backgroundColor: '#f5f5f5'}}>
                                {`user management_${index}`}
                            </div>
                        </PlTab>
                        <PlTab title={`配置管理_${index}`}>
                            <div style={{height: '200px', backgroundColor: '#f9f9f9'}}>
                                {`config management_${index}`}
                            </div>
                        </PlTab>
                        <PlTab title={`数据集管理_${index}`}>
                            <div style={{height: '300px', backgroundColor: '#ffffff'}}>
                                {`data map_${index}`}
                            </div>
                        </PlTab>
                    </React.Fragment>
                ))}
            </PlTabs>
        </DemoRow>
    )
})
