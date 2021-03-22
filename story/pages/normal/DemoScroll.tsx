import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlScroll} from "../../../src/packages/PlScroll";
import {reactive} from "@vue/reactivity";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import PlButton from "../../../src/packages/PlButton";
import './DemoScroll.scss'
import classNames from "plain-design-composition/src/lib/classNames";

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
    })

    function getClass(item: any) {
        console.log('item', item)
        return {}
    }

    return () => (
        <div className={'demo-scroll'}>
            <DemoRow title={'基本用法'}>
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
        </div>
    )
})