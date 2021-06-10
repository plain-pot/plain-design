import {designPage, reactive} from "plain-design-composition";
import React from "react";
import PlFilter from "../../../src/packages/Filter";
import {DemoRow} from "../../components/DemoRow";
import {PlSelectOption} from "../../../src";

export default designPage(() => {
    const state = reactive({
        textFilterOption: {
            field: 'normalText',
            filterName: 'text',
            handlerName: '类似',
            filterConfig: {},
            value: null,
        },
        selectFilterOption: {
            field: 'selectVal',
            filterName: 'select',
            handlerName: '等于',
            filterConfig: {
                options: () => <>
                    <PlSelectOption label="会员积分提醒" val="member"/>
                    <PlSelectOption label="物流中转通知" val="logistics"/>
                    <PlSelectOption label="新品首发通知" val="prod-launch"/>
                </>
            },
            value: null,
        },
    })
    return () => <>
        <DemoRow title="text">
            <PlFilter filterOption={state.textFilterOption}/>
            <span>搜索</span>
            {JSON.stringify(state.textFilterOption)}
        </DemoRow>
        <DemoRow title="select">
            <PlFilter filterOption={state.selectFilterOption}/>
            {JSON.stringify(state.selectFilterOption)}
        </DemoRow>
    </>
})