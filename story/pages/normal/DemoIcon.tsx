import {designComponent} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlIcon} from "../../../src/packages/PlIcon/PlIcon";

export default designComponent({
    setup() {
        return () => (
            <div>
                <DemoRow title={'基本用法'}>
                    <span>普通的文本：NORMAL normal</span>
                    <PlIcon icon="el-icon-bell"/>
                    <PlIcon icon="el-icon-bottom"/>
                </DemoRow>
            </div>
        )
    },
})