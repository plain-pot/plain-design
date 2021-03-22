import {designPage} from "plain-design-composition";
import {reactive} from "@vue/reactivity";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import {PlNumber} from "../../../src/packages/PlNumber";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {PlStepGroup} from "../../../src/packages/PlStepGroup";
import {PlStep} from "../../../src/packages/PlStep";
import $$message from "../../../src/packages/$$message";
import './DemoStep.scss'

export default designPage(() => {

    const state = reactive({
        val: {
            1: {
                index: 1,
                vertical: false,
                mini: true,
                titleAlignBottom: true,
            },
            2: {
                index: 1,
                vertical: false,
                mini: true,
                titleAlignBottom: true,
            },
            3: {
                index: 1,
                vertical: false,
                mini: true,
                titleAlignBottom: true,
            },
            4: {
                index: 1,
                vertical: false,
                mini: true,
                titleAlignBottom: true,
            },
            5: {
                index: 2,
            },
            6: {
                index: 1,
            },
        },
        showFlag: true,
        val1: {
            0: 1,
            1: 2,
            3: 'step1',
        },
    })

    return () => {
        return (
            <div className={'demo-step'}>
                <DemoRow title={'基本用法'}>
                    <DemoLine title={'当前步骤索引'}>
                        <PlNumber v-model={state.val[1].index}/>
                        <PlCheckbox label={'迷你尺寸'} v-model={state.val[1].mini}/>
                        <PlCheckbox label={'标题放在图标下方'} v-model={state.val[1].titleAlignBottom}/>
                        <PlCheckbox label={'显示[创建二维码]'} v-model={state.showFlag}/>
                    </DemoLine>
                    <DemoLine>
                        <PlStepGroup
                            current={state.val[1].index}
                            vertical={state.val[1].vertical}
                            mini={state.val[1].mini}
                            titleAlignBottom={state.val[1].titleAlignBottom}
                            currentStatus={state.val[1].index === 5 ? 'finish' : undefined}
                        >
                            <PlStep title="获取token" content="调用接口，获取token" onClick={() => $$message('获取token')}/>
                            <PlStep title="上传logo" content="使用token上传logo图片" onClick={() => $$message('上传logo')}/>
                            <PlStep title="创建卡券" content="调用接口创建卡券信息" onClick={() => $$message('创建卡券')}/>
                            {state.showFlag && <PlStep title="创建二维码" content="调用接口创建二维码" onClick={() => $$message('创建二维码')}/>}
                            <PlStep title="显示二维码" content="在应用中显示二维码" onClick={() => $$message('显示二维码')}/>
                        </PlStepGroup>
                    </DemoLine>
                </DemoRow>

                <DemoRow title={'步骤图标'}>
                    <DemoLine title={'当前步骤索引'}>
                        <PlNumber v-model={state.val[2].index}/>
                        <PlCheckbox label={'迷你尺寸'} v-model={state.val[2].mini}/>
                        <PlCheckbox label={'标题放在图标下方'} v-model={state.val[2].titleAlignBottom}/>
                        <PlCheckbox label={'显示[创建二维码]'} v-model={state.showFlag}/>
                    </DemoLine>
                    <DemoLine>
                        <PlStepGroup
                            current={state.val[2].index}
                            vertical={state.val[2].vertical}
                            mini={state.val[2].mini}
                            titleAlignBottom={state.val[2].titleAlignBottom}
                            currentStatus={state.val[2].index === 5 ? 'finish' : undefined}
                        >
                            <PlStep icon="el-icon-s-promotion" title="获取token" content="调用接口，获取token" onClick={() => $$message('获取token')}/>
                            <PlStep icon="el-icon-upload" title="上传logo" content="使用token上传logo图片" onClick={() => $$message('上传logo')}/>
                            <PlStep icon="el-icon-s-ticket" title="创建卡券" content="调用接口创建卡券信息" onClick={() => $$message('创建卡券')}/>
                            {state.showFlag && <PlStep icon="el-icon-document" title="创建二维码" content="调用接口创建二维码" onClick={() => $$message('创建二维码')}/>}
                            <PlStep icon="el-icon-camera-solid" title="显示二维码" content="在应用中显示二维码" onClick={() => $$message('显示二维码')}/>
                        </PlStepGroup>
                    </DemoLine>
                </DemoRow>
            </div>
        )
    }
})