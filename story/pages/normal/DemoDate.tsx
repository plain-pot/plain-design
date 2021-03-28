import {designPage, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlDatePanelYear} from "../../../src/packages/PlDate/panel/PlDatePanelYear";
import {DemoLine} from "../../components/DemoLine";
import {PlDatePanelMonth} from "../../../src/packages/PlDate/panel/PlDatePanelMonth";
import {PlDatePanelDate} from "../../../src/packages/PlDate/panel/PlDatePanelDate";
import PlDate from "../../../src/packages/PlDate";
import PlButton from "../../../src/packages/PlButton";
import PlAlert from "../../../src/packages/PlAlert";

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
                <DemoRow title={'日期选择'}>
                    <DemoRow title={'额外内容'}>
                        <DemoLine>{val[24]}</DemoLine>
                        <PlDate v-model={val[24]} foot={<>
                            <PlButton size={'mini'} label={'昨天'} onClick={() => setDate('yesterday')}/>
                            <PlButton size={'mini'} label={'今天'} onClick={() => setDate('today')}/>
                            <PlButton size={'mini'} label={'明天'} onClick={() => setDate('tomorrow')}/>
                        </>}/>
                    </DemoRow>
                    <DemoRow title={'日期'}>
                        <DemoLine>{val[24]}</DemoLine>
                        <PlDate v-model={val[24]}/>
                        <PlDate v-model={val[24]} displayFormat={'YYYY年MM月DD日'}/>
                    </DemoRow>
                    <DemoRow title={'日期时间'}>
                        <DemoLine>{val[25]}</DemoLine>
                        <PlDate v-model={val[25]} datetime/>
                        <PlDate v-model={val[25]} datetime defaultTime="08:30:00" displayFormat="YYYY年MM月DD日 HH时mm分ss秒"/>
                    </DemoRow>
                    <DemoRow title={'多选'}>
                        <DemoLine>{JSON.stringify(val[26])}</DemoLine>
                        <PlDate v-model={val[26]} multiple/>
                        <PlDate v-model={val[26]} multiple displayFormat="YYYY年MM月DD日" collapseTags={false}/>
                    </DemoRow>
                    <DemoRow title={'范围选择'}>
                        <DemoLine>start:{val[27]}, end:{val[28]}</DemoLine>
                        <PlDate v-model-start={val[27]} v-model-end={val[28]} range/>
                        <PlDate v-model-start={val[27]} v-model-end={val[28]} range displayFormat="YYYY年MM月DD日"/>
                    </DemoRow>
                    <DemoRow title={'最大最小值'}>
                        <div>max:2021-05-05</div>
                        <div>min:2019-05-05</div>
                        <PlDate v-model={val[29]} max="2021-05-05" min="2019-05-05"/>
                        <div>value:{val[29]}</div>
                        <PlDate v-model-start={val[30]} v-model-end={val[31]} range max="2021-05-05" min="2019-05-05"/>
                        <div>start:{val[30]}</div>
                        <div>end:{val[31]}</div>
                        <PlAlert>设置最大最小值之后，除了面板中的日期会标记为不可选的状态之外，在输入框中手动输入的值也会受最大最小值限制</PlAlert>
                    </DemoRow>
                    <DemoRow title={'最大最小值：日期时间'}>
                        <div>max:2021-05-05 12:00:00</div>
                        <div>min:2019-05-05 08:30:15</div>
                        <PlDate v-model={val[32]}
                                datetime
                                defaultTime="08:30:00"
                                max="2021-05-05 12:00:00"
                                min="2019-05-05 08:30:15"/>
                        <div>value:{val[32]}</div>
                        <PlDate v-model-start={val[33]}
                                v-model-end={val[34]}
                                range
                                datetime
                                defaultStartTime="08:30:00"
                                defaultEndTime="22:00:00"
                                max="2021-05-05 12:00:00"
                                min="2019-05-05 08:30:15"/>
                        <div>start:{val[33]}</div>
                        <div>end:{val[34]}</div>
                        <PlAlert>
                            设置defaultStartTie以及defaultEndTime可以设置日期时间范围选择的默认开始时间以及结束时间
                        </PlAlert>
                    </DemoRow>
                </DemoRow>
            </DemoRow>
        </div>
    )
})