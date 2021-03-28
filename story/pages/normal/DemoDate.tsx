import {designPage, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlDatePanelYear} from "../../../src/packages/PlDate/panel/PlDatePanelYear";
import {DemoLine} from "../../components/DemoLine";
import '../../../src/packages/PlDate'
import {PlDatePanelMonth} from "../../../src/packages/PlDate/panel/PlDatePanelMonth";
import {PlDatePanelDate} from "../../../src/packages/PlDate/panel/PlDatePanelDate";

export default designPage(() => {

    const val = reactive({val: {} as any}).val

    return () => (
        <div>
            <DemoRow title={'panel'}>
                <DemoRow title={'panel year'}>
                    <DemoLine>{val[0]}</DemoLine>
                    <PlDatePanelYear v-model={val[0]}/>
                </DemoRow>
                <DemoRow title={'panel month'}>
                    <DemoLine>{val[1]}</DemoLine>
                    <PlDatePanelMonth v-model={val[1]}/>
                </DemoRow>
                <DemoRow title={'panel date'}>
                    <DemoLine>{val[2]}</DemoLine>
                    <PlDatePanelDate v-model={val[2]}/>
                </DemoRow>
            </DemoRow>
        </div>
    )
})