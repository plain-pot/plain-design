import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import React from "react";
import {PlAutoComplete} from "../../../src";

export const demo1 = designPage(() => {
    const state = reactive({
        text: ''
    })
    return () => (
        <DemoRow title="基本用法">
            <PlAutoComplete v-model={state.text}/>
            {state.text}
        </DemoRow>
    )
})