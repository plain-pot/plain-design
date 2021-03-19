import {designComponent} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlLoading} from "../../../src/packages/PlLoading";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {reactive} from "@vue/reactivity";
import {PlLoadingMask} from "../../../src/packages/PlLoadingMask";
import {PlButton} from "../../../src";

// console.log(delay, PlainLoading)

export default designComponent({
    setup() {

        const state = reactive({
            flag1: {
                loading: true,
                init: true,
            },
            flag2: {
                loading: true,
                init: true,
            },
            bar: null,
        })

        return () => (
            <div>
                <DemoRow title={"基本用法"}>
                    <PlLoading/>
                </DemoRow>
                <DemoRow title={"类型"}>
                    <PlLoading type={'alpha'}/>
                    <PlLoading type={'beta'}/>
                    <PlLoading type={'gamma'}/>
                    <PlLoading type={'delta'}/>
                    <PlLoading type={'ice'}/>
                </DemoRow>
                <DemoRow title={"字体大小"}>
                    <div>
                        <PlLoading type={'alpha'} style={{fontSize: '24px'}}/>
                        <PlLoading type={'beta'} style={{fontSize: '24px'}}/>
                        <PlLoading type={'gamma'} style={{fontSize: '24px'}}/>
                        <PlLoading type={'delta'} style={{fontSize: '24px'}}/>
                        <PlLoading type={'ice'} style={{fontSize: '24px'}}/>
                    </div>
                </DemoRow>
                <DemoRow title={"状态颜色"}>
                    <PlLoading type={'alpha'} status={'primary'}/>
                    <PlLoading type={'alpha'} status={'success'}/>
                    <PlLoading type={'alpha'} status={'warn'}/>
                    <PlLoading type={'alpha'} status={'error'}/>
                    <PlLoading type={'alpha'} status={'info'}/>
                </DemoRow>
                <DemoRow title={"自定义颜色"}>
                    <div style={{color: 'blueviolet'}}>
                        <PlLoading type={'alpha'}/>
                        <PlLoading type={'alpha'}/>
                        <PlLoading type={'alpha'}/>
                        <PlLoading type={'alpha'}/>
                        <PlLoading type={'alpha'}/>
                    </div>
                </DemoRow>
                <DemoRow title={"组件调用loading-mask"}>
                    <PlCheckbox label={'init'} v-model={state.flag1.init}/>
                    <PlCheckbox label={'open mask'} v-model={state.flag1.loading}/>
                    <span>如果父节点的position不为fixed、relative、absolute，pl-loading-mask会自动将父节点的样式设置为 relative</span>
                    {!!state.flag1.init && (
                        <div style={{height: '300px', width: '300px', backgroundColor: '#f6f6f6'}}>
                            <PlButton label={'this is button'}/>
                            <PlLoadingMask v-model={state.flag1.loading} message={'loading...'}/>
                        </div>
                    )}
                </DemoRow>
            </div>
        )
    },
})