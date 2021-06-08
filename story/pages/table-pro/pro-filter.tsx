import {designPage, reactive} from "plain-design-composition";
import React from "react";
import PlFilter from "../../../src/packages/Filter";

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
        <div style={{padding: '16px', backgroundColor: 'white'}}>
            <PlFilter filterOption={state.filterOption}/>
        </div>
    </>
})