import {designComponent, reactive} from "plain-design-composition";
import React from "react";
import './TestGroupTransition.scss'
import {PlButton} from "../../../src/packages/PlButton";
import PlCollapseTransition from "../../../src/packages/PlCollapseTransition";
import {DemoRow} from "../../components/DemoRow";

export default designComponent({
    setup() {

        const state = reactive({
            val: {
                3: true,
            } as any,
        })

        return () => (
            <div>
                <DemoRow title={'测试自动高度的外部节点'}>
                    <PlButton label={state.val[1] ? 'to hide' : 'to show'} onClick={() => state.val[1] = !state.val[1]}/>
                    <PlCollapseTransition show={state.val[1]}>
                        <div>
                            <div style={{height: '180px', color: 'white', backgroundColor: 'blueviolet'}}>
                                this is content
                            </div>
                        </div>
                    </PlCollapseTransition>
                </DemoRow>
                <DemoRow title={'一开始就是显示'}>
                    <PlCollapseTransition show={true}>
                        <div>
                            <div style={{height: '180px', color: 'white', backgroundColor: 'blueviolet'}}>
                                this is content
                            </div>
                        </div>
                    </PlCollapseTransition>
                </DemoRow>
                <DemoRow title={'测试底层节点设置定高度'}>
                    <PlButton label={state.val[2] ? 'to hide' : 'to show'} onClick={() => state.val[2] = !state.val[2]}/>
                    <PlCollapseTransition show={state.val[2]}>
                        <div style={{height: '180px', color: 'white', backgroundColor: 'blueviolet'}}>
                            this is content
                        </div>
                    </PlCollapseTransition>
                </DemoRow>
                <DemoRow title={'测试底层节点设置定内边距'}>
                    <PlButton label={state.val[3] ? 'to hide' : 'to show'} onClick={() => state.val[3] = !state.val[3]}/>
                    <PlCollapseTransition show={state.val[3]}>
                        <div style={{height: '180px', color: 'white', backgroundColor: 'blueviolet', paddingTop: '20px', paddingBottom: '20px'}}>
                            this is content
                        </div>
                    </PlCollapseTransition>
                </DemoRow>
                <DemoRow title={'测试底层节点设置定内边距(border-box)'}>
                    <PlButton label={state.val[4] ? 'to hide' : 'to show'} onClick={() => state.val[4] = !state.val[4]}/>
                    <PlCollapseTransition show={state.val[4]}>
                        <div style={{boxSizing: 'border-box', height: '180px', color: 'white', backgroundColor: 'blueviolet', paddingTop: '20px', paddingBottom: '20px'}}>
                            this is content
                        </div>
                    </PlCollapseTransition>
                </DemoRow>
            </div>
        )
    },
})