import {designPage, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src";
import {PlDialog} from "../../../src/packages/PlDialog";

export default designPage(() => {

    const state = reactive({
        val: {} as any,
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlButton label={'open dialog'} onClick={() => state.val[0] = !state.val[0]}/>
                <PlDialog v-model={state.val[0]}>
                    hello world
                </PlDialog>
            </DemoRow>
        </div>
    )
})