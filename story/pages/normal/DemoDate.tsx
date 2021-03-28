import {designPage, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlDatePanelYear} from "../../../src/packages/PlDate/panel/PlDatePanelYear";
import {DemoLine} from "../../components/DemoLine";
import '../../../src/packages/PlDate'

export default designPage(() => {

    const val = reactive({val: {} as any}).val

    return () => (
        <div>
            <DemoRow title={'panel year'}>
                <DemoLine>{val[0]}</DemoLine>
                <PlDatePanelYear v-model={val[0]}/>
            </DemoRow>
        </div>
    )
})