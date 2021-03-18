import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "@vue/reactivity";
import React from "react";
import {PlInput} from "../../../src/packages/PlInput";

export default designPage(() => {

    const state = reactive({
        val: {} as any
    })

    return () => {
        return (
            <div>
                <DemoRow title={'基本用法'}>
                    <PlInput v-model={state.val[0]}/>
                    <PlInput v-model={state.val[0]}/>
                    {state.val[0]}
                </DemoRow>
            </div>
        )
    }
})