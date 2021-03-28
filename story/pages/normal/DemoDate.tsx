import {designPage, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlDatePanelYear} from "../../../src/packages/PlDate/panel/PlDatePanelYear";
import {DemoLine} from "../../components/DemoLine";
import {PlDatePanelMonth} from "../../../src/packages/PlDate/panel/PlDatePanelMonth";
import {PlDatePanelDate} from "../../../src/packages/PlDate/panel/PlDatePanelDate";
import PlDate from "../../../src/packages/PlDate";
import PlButton from "../../../src/packages/PlButton";

export default designPage(() => {

    const val = reactive({val: {} as any}).val

    function setDate(type: 'yesterday' | 'today' | 'tomorrow') {
        const pd = PlDate.plainDate.today('YYYY-MM-DD', 'YYYY-MM-DD')
        switch (type) {
            case 'yesterday':
                val[24] = pd.useMonthDate(pd.month, pd.date - 1).getValue()
                break
            case 'today':
                val[24] = pd.getValue()
                break
            case 'tomorrow':
                val[24] = pd.useMonthDate(pd.month, pd.date + 1).getValue()
                break
        }
    }

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
            <DemoRow title={'PlDate'}>
                <DemoRow title={'额外内容'}>
                    <DemoLine>{val[4]}</DemoLine>
                    <PlDate v-model={val[4]} foot={<>
                        <PlButton size={'mini'} label={'昨天'} onClick={() => setDate('yesterday')}/>
                        <PlButton size={'mini'} label={'今天'} onClick={() => setDate('today')}/>
                        <PlButton size={'mini'} label={'明天'} onClick={() => setDate('tomorrow')}/>
                    </>}/>
                </DemoRow>
            </DemoRow>
        </div>
    )
})