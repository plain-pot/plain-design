import React from "react"
import {designPage} from "plain-design-composition";
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlTable from "../../../src/packages/PlTable";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import Plc from "../../../src/packages/Plc";
import {PlInput} from "../../../src/packages/PlInput";
import {PlNumber} from "../../../src/packages/PlNumber";
import PlDate from "../../../src/packages/PlDate";
import PlColorPicker from "../../../src/packages/PlColorPicker";
import {PlcGroup} from "../../../src/packages/PlTable/plc/standard";

export default designPage(() => {

    const summaryData = [
        {
            "id": 0,
            "color": "#79f285",
            "name": "Lisa",
            "date": "2002-04-28",
            "star": "★★★★★★★",
            "size": 49
        },
        {
            "id": 1,
            "color": "#f27990",
            "name": "George",
            "date": "2019-01-06",
            "star": "★★★★★★★★",
            "size": 74
        },
    ]

    return () => (
        <div>
            <DemoRow title={'展开行'}>
                <PlTable
                    data={data}
                    summaryData={summaryData}
                    virtual
                >
                    <Plc.PlcIndex/>
                    <Plc.PlcExpand
                        toggleOnClickRow
                        expand={({row}) => (
                            <PlForm column={1} disabled key={row.id}>
                                <PlFormItem label={'普通文本'}>{row.name}</PlFormItem>
                                <PlFormItem label={'输入框'}><PlInput disabled={false} v-model={row.name}/></PlFormItem>
                                <PlFormItem label={'数字'}><PlNumber v-model={row.size}/></PlFormItem>
                                <PlFormItem label={'日期'}><PlDate v-model={row.date}/></PlFormItem>
                                <PlFormItem label={'颜色'}><PlColorPicker v-model={row.color}/></PlFormItem>
                            </PlForm>
                        )}
                    />
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'大小'} field={'size'}/>
                    <PlcGroup title={'地址'} fixed={'left'}>
                        <Plc field="date" title="日期"/>
                        <Plc field="color" title="颜色"/>
                    </PlcGroup>
                    <Plc title={'编号'} field={'id'}/>
                    <Plc title={'评分'} field={'star'}/>
                    <Plc title={'地址'} field={'addr'}/>

                    <Plc title={'名称'} field={'name'} fixed="right"/>
                    <PlcGroup title={'站点'} fixed={'right'}>
                        <Plc field={'url'} title={'链接'}/>
                        <Plc field={'domain'} title={'域名'}/>
                    </PlcGroup>

                    <Plc title="协议" field="protocol"/>
                    <Plc title="邮箱" field="email"/>
                    <Plc title="ip" field="ip"/>
                </PlTable>
            </DemoRow>
        </div>
    )
})