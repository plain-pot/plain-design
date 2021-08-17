import {designPage} from "plain-design-composition";
import React from "react";
import {PlTab, PlTabs} from "../../../src";
import {DemoRow} from "../../components/DemoRow";

export const demoText = designPage(() => {
    return () => (
        <DemoRow title="head top">
            <PlTabs headType="text">
                <PlTab title="用户管理">
                    <div style={{height: '100px'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
            <PlTabs headType="text" headPosition="bottom">
                <PlTab title="用户管理">
                    <div style={{height: '100px'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const demoCard = designPage(() => {
    return () => (
        <DemoRow title="head card">
            <PlTabs headType="card">
                <PlTab title="用户管理">
                    <div style={{height: '100px'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
            <PlTabs headType="card" headPosition="bottom">
                <PlTab title="用户管理">
                    <div style={{height: '100px'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const demoShadow = designPage(() => {
    return () => (
        <DemoRow title="head shadow">
            <PlTabs headType="shadow">
                <PlTab title="用户管理">
                    <div style={{height: '100px'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
            <PlTabs headType="shadow" headPosition="bottom">
                <PlTab title="用户管理">
                    <div style={{height: '100px'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="数据集管理">
                    <div style={{height: '300px'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const demoTopLong = designPage(() => {
    return () => (
        <DemoRow title="head card 超长列表">
            <PlTabs>
                {new Array(10).fill(0).map((_, index) => (
                    <React.Fragment key={index}>
                        <PlTab title={`用户管理_${index}`}>
                            <div style={{height: '100px'}}>
                                {`user management_${index}`}
                            </div>
                        </PlTab>
                        <PlTab title={`配置管理_${index}`}>
                            <div style={{height: '200px'}}>
                                {`config management_${index}`}
                            </div>
                        </PlTab>
                        <PlTab title={`数据集管理_${index}`}>
                            <div style={{height: '300px'}}>
                                {`data map_${index}`}
                            </div>
                        </PlTab>
                    </React.Fragment>
                ))}
            </PlTabs>
        </DemoRow>
    )
})

/*
export const demoBottom = designPage(() => {
    return () => (
        <DemoRow title="head bottom">
            <PlTabs headPosition="bottom">
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
                <PlTab title="数据集管理">
                    <div style={{height: '300px', backgroundColor: '#606266'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const demoTopLong = designPage(() => {
    return () => (
        <DemoRow title="head top 超长列表">
            <PlTabs>
                {new Array(10).fill(0).map((_, index) => (
                    <React.Fragment key={index}>
                        <PlTab title={`用户管理_${index}`}>
                            <div style={{height: '100px', backgroundColor: '#c6c6c6'}}>
                                {`user management_${index}`}
                            </div>
                        </PlTab>
                        <PlTab title={`配置管理_${index}`}>
                            <div style={{height: '200px', backgroundColor: '#969696'}}>
                                {`config management_${index}`}
                            </div>
                        </PlTab>
                        <PlTab title={`数据集管理_${index}`}>
                            <div style={{height: '300px', backgroundColor: '#606266'}}>
                                {`data map_${index}`}
                            </div>
                        </PlTab>
                    </React.Fragment>
                ))}
            </PlTabs>
        </DemoRow>
    )
})

export const demoLeft = designPage(() => {
    return () => (
        <DemoRow title="head left">
            <PlTabs headPosition="left">
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
                <PlTab title="数据集管理">
                    <div style={{height: '300px', backgroundColor: '#606266'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})

export const demoRight = designPage(() => {
    return () => (
        <DemoRow title="head right">
            <PlTabs headPosition="right">
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
                <PlTab title="数据集管理">
                    <div style={{height: '300px', backgroundColor: '#606266'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})*/
