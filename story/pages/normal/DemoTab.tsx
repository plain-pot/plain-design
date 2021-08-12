import {designPage} from "plain-design-composition";
import React from "react";
import {PlTab, PlTabs,PlInput} from "../../../src";
import {DemoRow} from "../../components/DemoRow";

export const demo1 = designPage(() => {
    return () => (
        <DemoRow title="基本用法">
            <PlTabs>
                <PlTab title="用户管理">
                    <div style={{height: '100px', backgroundColor: '#c6c6c6'}}>
                        user management
                    </div>
                </PlTab>
                <PlTab title="配置管理">
                    <div style={{height: '200px', backgroundColor: '#969696'}}>
                        config management
                    </div>
                </PlTab>
                <PlTab title="用户管理">
                    <div style={{height: '300px', backgroundColor: '#606266'}}>
                        data map
                    </div>
                </PlTab>
            </PlTabs>
        </DemoRow>
    )
})