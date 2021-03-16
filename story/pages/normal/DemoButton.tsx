import {designComponent, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src/packages/PlButton/PlButton";
import {Modes, StoryShapes, StorySizes, StoryStatus} from "../../story.utils";

export default designComponent({
    setup() {

        const state = reactive({
            show: true,
            loadingFlag: true,
        })

        return {
            render: () => (
                <div>
                    <DemoRow title={"基本用法"}>
                        <button onClick={() => state.show = !state.show}>show button:{state.show}</button>
                        {!!state.show && <>
                            <PlButton label={"按钮"}/>
                            <span>普通文本</span>
                        </>}
                    </DemoRow>
                    <DemoRow title={'状态'}>
                        {StoryStatus.map(item => <PlButton status={item.status} key={item.status} label={item.label}/>)}
                    </DemoRow>
                    <DemoRow title={'模式'}>
                        {Modes.map(mode => (
                            <div key={mode}>
                                {StoryStatus.map(item => <PlButton mode={mode} status={item.status} key={item.status} label={item.label}/>)}
                            </div>
                        ))}
                    </DemoRow>
                    <DemoRow title={'形状'}>
                        {StoryShapes.map(item => <PlButton key={item.shape} shape={item.shape} label={item.label}/>)}
                    </DemoRow>
                    <DemoRow title={'大小'}>
                        {StorySizes.map(item => <PlButton key={item.size} size={item.size} label={item.label}/>)}
                    </DemoRow>

                    <DemoRow title={'图标按钮'}>
                        <PlButton icon="el-icon-search" label="搜索"/>
                        <PlButton icon="el-icon-s-tools" label="搜索" shape="round"/>
                        <PlButton icon="el-icon-search" shape="round"/>
                        <PlButton icon="el-icon-search"/>
                        <PlButton icon="el-icon-search" mode="stroke"/>
                        <PlButton icon="el-icon-search" mode="stroke" shape="round"/>
                        <PlButton icon="el-icon-search" mode="text"/>
                    </DemoRow>

                    <DemoRow title={'块级按钮'}>
                        <PlButton label={'按钮'} block/>
                    </DemoRow>

                    <DemoRow title={'禁用按钮'}>
                        <PlButton label="按钮" mode="fill" disabled icon="el-icon-search"/>
                        <PlButton label="按钮" mode="stroke" disabled/>
                        <PlButton label="按钮" mode="text" disabled/>
                    </DemoRow>

                    <DemoRow title={'加载状态'}>
                        <PlButton label="搜索" loading={state.loadingFlag} width="90"/>
                        <PlButton icon="el-icon-search" label="搜索" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" label="搜索" shape="round" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" shape="round" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" mode="stroke" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" mode="stroke" shape="round" loading={state.loadingFlag}/>
                        <PlButton icon="el-icon-search" mode="text" loading={state.loadingFlag}/>
                    </DemoRow>

                    <DemoRow title={'click节流'}>
                        <PlButton label="1000ms" onClick={() => console.log(String(Date.now()))} throttleClick/>
                        <PlButton label="500ms" onClick={() => console.log(String(Date.now()))} throttleClick={500}/>
                    </DemoRow>
                </div>
            )
        }
    },
})