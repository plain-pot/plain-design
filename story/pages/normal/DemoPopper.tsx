import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "@vue/reactivity";
import {PlPopper} from "../../../src/packages/PlPopper";
import PlButton from "../../../src/packages/PlButton";
import PlIcon from "../../../src/packages/PlIcon";

export default designPage(() => {

    const val = reactive({val: {}}).val as any

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlPopper title={'标题'} message={'消息文本'}>
                    <span>默认hover显示</span>
                </PlPopper>
                <PlPopper title={'标题'} message={'消息文本'}>
                    <PlButton mode={'text'}>默认hover显示</PlButton>
                </PlPopper>
                <PlPopper>
                    {{
                        default: <><span>自定义内容</span></>,
                        title: <>
                            <span>自定义标题</span>
                            <PlIcon icon={'el-icon-info'}/>
                        </>,
                        popper: <>
                            <p>popper content 111</p>
                            <p>popper content 222</p>
                        </>
                    }}
                </PlPopper>
                <PlPopper title={'标题'} message={'消息文本'} placement={'bottom'}>
                    <PlIcon icon={'el-icon-info'}/>
                </PlPopper>
            </DemoRow>
        </div>
    )
})