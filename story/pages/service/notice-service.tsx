import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src/packages/PlButton/PlButton";
import {useNotice} from "../../../src/packages/PlNotice";

export default designPage(() => {

    const $notice = useNotice()

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'基本用法'} onClick={() => $notice('系统不会保留你所做的更改，请在退出之前确认是否已经提交你的操作记录，否则系统退出后当前内容将丢失！')}/>
            </DemoRow>
        </div>
    )
})