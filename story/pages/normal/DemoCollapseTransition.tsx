import {designComponent, reactive} from "plain-design-composition";
import React from "react";
import './DemoCollapseTransition.scss'
import {PlButton} from "../../../src/packages/PlButton";
import PlCollapseTransition from "../../../src/packages/PlCollapseTransition";
import {DemoRow} from "../../components/DemoRow";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import {shuffle} from "plain-utils/object/shuffle";

export default designComponent({
    setup() {

        const state = reactive({
            cities: [
                {id: '广州市', name: '广州市'},
                {id: '上海市', name: '上海市'},
                {id: '北京市', name: '北京市'},
                {id: '深圳市', name: '深圳市'},
                {id: '长沙市', name: '长沙市'},
                {id: '南京市', name: '南京市'},
            ],
            val: {
                3: true,
            } as any,
        })

        let count = 0;
        const handler = {
            add: (index: number) => {
                const item = state.cities[index]
                if (!item) return
                state.cities.splice(index + 1, 0, {
                    id: `count_${count++}`,
                    name: `${item.id}_${count}`,
                })
            },
            remove: (index: number) => {
                state.cities.splice(index, 1)
            },
        }

        return () => (
            <div className={'demo-collapse-transition'}>
                <DemoRow>
                    <PlButtonGroup>
                        <PlButtonGroup>
                            <PlButton onClick={() => handler.add(0)}>add</PlButton>
                            <PlButton onClick={() => handler.remove(0)}>remove</PlButton>
                            <PlButton onClick={() => state.cities = shuffle(state.cities)}>shuffle</PlButton>
                        </PlButtonGroup>
                    </PlButtonGroup>
                </DemoRow>
                <DemoRow title={'测试自动高度的外部节点'}>
                    <PlButton label={state.val[1] ? 'to hide' : 'to show'} onClick={() => state.val[1] = !state.val[1]}/>
                    <PlCollapseTransition show={state.val[1]}>
                        <div>
                            <div style={{color: 'white', backgroundColor: 'blueviolet'}}>
                                <ul>
                                    {state.cities.map(item => (
                                        <li key={item.id} style={{height: '28px', lineHeight: '28px'}}>{item.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </PlCollapseTransition>
                    <button>next</button>
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