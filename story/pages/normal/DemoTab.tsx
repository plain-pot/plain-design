import {designPage} from "plain-design-composition";
import React from "react";
import {PlTab, PlTabs,PlInput} from "../../../src";
import {DemoRow} from "../../components/DemoRow";

export const demo1 = designPage(() => {
    return () => (
        <DemoRow title="基本用法">
            <PlTabs>
                <PlTab title="用户管理">
                    <div style={{height: '100px', backgroundColor: '#c6c6c6'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', backgroundColor: '#969696'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="用户管理">
                    <div style={{height: '300px', backgroundColor: '#606266'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const longDemo = designPage(() => {
    return () => (
        <DemoRow title="超长列表">
            <PlTabs>
                {new Array(10).fill(null).map((_, index) => (
                    <React.Fragment key={index}>
                        <PlTab title={"用户管理_" + index}>
                            <span>用户管理_${index}：</span>
                            <PlInput onMounted={() => console.log('mounted', '用户管理')}/>
                        </PlTab>
                        <PlTab title={"子模块数据管理_" + index}>
                            <span>子模块数据管理_${index}：</span>
                            <PlInput onMounted={() => console.log('mounted', '子模块数据管理')}/>
                        </PlTab>
                        <PlTab title={"数据集_" + index}>
                            <span>数据集_${index}：</span>
                            <PlInput onMounted={() => console.log('mounted', '数据集')}/>
                        </PlTab>
                    </React.Fragment>
                ))}
            </PlTabs>
        </DemoRow>
    )
})

export const demo3 = designPage(() => {
    return () => (
        <DemoRow title="基本用法">
            <PlTabs>
                <PlTab title="用户管理">
                    <div style={{height: '100px', backgroundColor: '#c6c6c6'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', backgroundColor: '#969696'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="用户管理">
                    <div style={{height: '300px', backgroundColor: '#606266'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const demo4 = designPage(() => {
    return () => (
        <DemoRow title="基本用法">
            <PlTabs>
                <PlTab title="用户管理">
                    <div style={{height: '100px', backgroundColor: '#c6c6c6'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', backgroundColor: '#969696'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="用户管理">
                    <div style={{height: '300px', backgroundColor: '#606266'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})