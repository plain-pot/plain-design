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
            </div>
        )
    },
})