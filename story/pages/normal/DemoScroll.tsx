import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlScroll} from "../../../src/packages/PlScroll";
import {reactive} from "@vue/reactivity";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import './DemoScroll.scss'
import classNames from "plain-design-composition/src/lib/classNames";
import {PlCheckboxGroup} from "../../../src/packages/PlCheckboxGroup";
import PlList from "../../../src/packages/PlList";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const state = reactive({
        list: (() => {
            let ret = []
            let i = 0;
            while (i < 40) {
                ret.push(i++)
            }
            return ret
        })(),
        checkboxValue: [] as string[],
    })

    function getClass(item: any) {
        console.log('item', item)
        return {}
    }

    return () => (
        <div className={'demo-scroll'}>
            <DemoRow title={'基本用法(检查滚动的时候会不会导致插槽的内容重新执行)'}>
                <div className={'demo-scroll-wrapper'} style={{display: 'inline-block', verticalAlign: 'top'}}>
                    <PlScroll>
                        <div>
                            {state.list.map((item, index) => (
                                <div className={classNames(['demo-scroll-label', getClass(item),])} key={index}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </PlScroll>
                </div>
                <PlButtonGroup vertical>
                    <PlButton label={'添加'} icon={'el-icon-circle-plus-outline'} onClick={() => state.list.push(state.list.length + 1)}/>
                    <PlButton label={'删除'} icon={'el-icon-remove-outline'} onClick={() => state.list.shift()}/>
                </PlButtonGroup>
            </DemoRow>
            <DemoRow title={'基本用法'}>
                <div className="demo-scroll-wrapper">
                    <PlScroll>
                        <div style={{height: '400px', width: '400px'}} className={'demo-scroll-content'}>
                            this is content
                        </div>
                    </PlScroll>
                </div>
            </DemoRow>
            <DemoRow title={'基本用法(多选列表)'}>
                <div className="demo-scroll-wrapper" style={{display: 'inline-block', verticalAlign: 'top'}}>
                    <PlScroll>
                        <PlCheckboxGroup v-model={state.checkboxValue}>
                            <PlList>
                                {state.list.map(item => (
                                    <div className={'demo-scroll-label'} key={item}>
                                        <PlCheckbox val={item}/>、
                                        {item}
                                    </div>
                                ))}
                            </PlList>
                        </PlCheckboxGroup>
                    </PlScroll>
                </div>
                <PlButtonGroup vertical>
                    <PlButton label={'添加'} icon={'el-icon-circle-plus-outline'} onClick={() => state.list.push(state.list.length + 1)}/>
                    <PlButton label={'删除'} icon={'el-icon-remove-outline'} onClick={() => state.list.shift()}/>
                </PlButtonGroup>
                {JSON.stringify(state.checkboxValue)}
            </DemoRow>
        </div>
    )
})