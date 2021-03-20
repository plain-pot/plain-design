import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "@vue/reactivity";
import PlToggle from "../../../src/packages/PlToggle";

export default designPage(() => {

    const state = reactive({
        val: {
            1: '',
        } as any,
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlToggle v-model={state.val[0]}/>
                <PlToggle v-model={state.val[0]}/>
                {String(state.val[0])}
            </DemoRow>
        </div>
    )
})