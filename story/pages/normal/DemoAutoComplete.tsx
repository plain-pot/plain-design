import {designPage, reactive} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import React from "react";
import {PlAutoComplete} from "../../../src";
import addressData from '../data/address.json'

export const demo1 = designPage(() => {
    const state = reactive({
        text: ''
    })

    const suggestion = (addressData as any[]).map(({name}) => (name))

    return () => (
        <DemoRow title="基本用法">
            <PlAutoComplete v-model={state.text} suggestion={suggestion}/>
            {state.text}
        </DemoRow>
    )
})