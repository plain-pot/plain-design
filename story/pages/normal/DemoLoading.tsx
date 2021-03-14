import {designComponent} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlLoading} from "../../../src/packages/PlLoading/PlLoading";

// console.log(delay, PlainLoading)

export default designComponent({
    setup() {
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
                <DemoRow title={"基本用法"}>
                    <PlLoading/>
                </DemoRow>
                <DemoRow title={"基本用法"}>
                    <PlLoading/>
                </DemoRow>
            </div>
        )
    },
})