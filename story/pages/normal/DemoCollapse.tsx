import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "plain-design-composition";
import PlCollapse from "../../../src/packages/PlCollapse";
import PlIcon from "../../../src/packages/PlIcon";
import PlCollapseGroup from "../../../src/packages/PlCollapseGroup";

export default designPage(() => {

    const val = reactive({
        val: {} as any
    }).val

    return () => (
        <div>
            <DemoRow title={'Collapse：基本用法'}>
                <PlCollapse title={'折叠标题'}>
                    <div style={{fontSize: '12px'}}>
                        <ul>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                            <li>折叠内容</li>
                        </ul>
                    </div>
                </PlCollapse>
            </DemoRow>
            <DemoRow title={'Collapse:自定义标题'}>
                <PlCollapse>
                    {{
                        default: <>
                            <div style={{fontSize: '12px'}}>
                                <ul>
                                    <li>折叠内容</li>
                                    <li>折叠内容</li>
                                    <li>折叠内容</li>
                                    <li>折叠内容</li>
                                    <li>折叠内容</li>
                                    <li>折叠内容</li>
                                </ul>
                            </div>
                        </>,
                        title: <>
                            <span>折叠标题</span>
                            <PlIcon icon={'el-icon-info'}/>
                        </>
                    }}
                </PlCollapse>
            </DemoRow>
            <DemoRow title={'CollapseGroup：基本用法'}>
                <PlCollapseGroup>
                    <PlCollapse title={'折叠标题'}>
                        <div style={{fontSize: '12px'}}>
                            <ul>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                            </ul>
                        </div>
                    </PlCollapse>
                    <PlCollapse title={'折叠标题'}>
                        <div style={{fontSize: '12px'}}>
                            <ul>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                            </ul>
                        </div>
                    </PlCollapse>
                    <PlCollapse title={'折叠标题'}>
                        <div style={{fontSize: '12px'}}>
                            <ul>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                            </ul>
                        </div>
                    </PlCollapse>
                </PlCollapseGroup>
            </DemoRow>

            <DemoRow title={'CollapseGroup：限制展开的个数'}>
                {JSON.stringify(val[2])}
                <PlCollapseGroup v-model={val[2]} style={{marginBottom: '20px'}} limit={2}>
                    <PlCollapse title={'折叠标题1'} val={'1'}>
                        <div style={{fontSize: '12px'}}>
                            <ul>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                            </ul>
                        </div>
                    </PlCollapse>
                    <PlCollapse title={'折叠标题2'} val={'2'}>
                        <div style={{fontSize: '12px'}}>
                            <ul>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                            </ul>
                        </div>
                    </PlCollapse>
                    <PlCollapse title={'折叠标题3'} val={'3'}>
                        <div style={{fontSize: '12px'}}>
                            <ul>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                            </ul>
                        </div>
                    </PlCollapse>
                </PlCollapseGroup>
                <PlCollapseGroup v-model={val[2]} disabled>
                    <PlCollapse title={'折叠标题1'} val={'1'}>
                        <div style={{fontSize: '12px'}}>
                            <ul>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                            </ul>
                        </div>
                    </PlCollapse>
                    <PlCollapse title={'折叠标题2'} val={'2'}>
                        <div style={{fontSize: '12px'}}>
                            <ul>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                            </ul>
                        </div>
                    </PlCollapse>
                    <PlCollapse title={'折叠标题3'} val={'3'}>
                        <div style={{fontSize: '12px'}}>
                            <ul>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                                <li>折叠内容</li>
                            </ul>
                        </div>
                    </PlCollapse>
                </PlCollapseGroup>
            </DemoRow>
        </div>
    )
})