import {designPage, reactive} from "plain-design-composition";
import React from "react";
import PlFilter from "../../../src/packages/Filter";
import {DemoRow} from "../../components/DemoRow";

export default designPage(() => {
    const state = reactive({
        filterOption: {
            field: 'normalText',
            filterName: 'text',
            handlerName: '类似',
            filterValue: {},
        }
    })
    return () => <>
        <DemoRow title="basic">
            <PlFilter filterOption={state.filterOption}/>
            <span>搜索</span>
            {JSON.stringify(state.filterOption.filterValue)}
        </DemoRow>
    </>
})