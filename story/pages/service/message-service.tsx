import {designComponent} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src/packages/PlButton/PlButton";
import {useMessage} from "../../../src/packages/PlMessage";

export default designComponent({
    setup() {

        let count = 0;
        const $message = useMessage()

        return () => (
            <div>
                <DemoRow title={'基本用法'}>
                    <PlButton label={'显示基本消息'} onClick={() => $message('hello world' + count++)}/>
                </DemoRow>
                <DemoRow title={'提示类型'}>
                    <PlButton onClick={() => $message.lite('提示信息！')} label="lite" style={{backgroundColor: 'white', border: 'solid 1px #ccc', color: '#333'}}/>
                    <PlButton onClick={() => $message.dark('提示信息！')} label="dark" style={{backgroundColor: '#333', border: 'none'}}/>
                    <PlButton onClick={() => $message.primary('提示信息！')} label="primary" status="primary"/>
                    <PlButton onClick={() => $message.success('提示信息！')} label="success" status="success"/>
                    <PlButton onClick={() => $message.warn('提示信息！')} label="warn" status="warn"/>
                    <PlButton onClick={() => $message.error('提示信息！')} label="error" status="error"/>
                    <PlButton onClick={() => $message.info('提示信息！')} label="help" status="info"/>
                </DemoRow>
            </div>
        )
    },
})