import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import PlAlert from "../../../src/packages/PlAlert";

export default designPage(() => {
    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <div style={{width: '800px'}}>
                    <PlAlert style={{marginBottom: '10px'}}>
                        Form校验模式的有点就是能够兼容所有的组件，包括原生表单控件以及其他组件库的组件。
                        当校验失败的时候，FormItem底部必定会显示红色的警告信息；
                    </PlAlert>
                    <PlAlert label={'不显示状态图标'} icon={null}/>
                </div>
            </DemoRow>
        </div>
    )
})