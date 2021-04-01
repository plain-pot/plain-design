import {designPage, reactive} from "plain-design-composition";
import React from "react";
import data from '../data/data-1.json'
import {DemoRow} from "../../components/DemoRow";
import PlForm from "../../../src/packages/PlForm";
import PlFormItem from "../../../src/packages/PlFormItem";
import {PlNumber} from "../../../src/packages/PlNumber";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import PlTable from "../../../src/packages/PlTable";
import {Plc} from "../../../src/packages/Plc";
import PlcGroup from "../../../src/packages/PlTable/plc/core/PlcGroup";

export default designPage(() => {

    const state = reactive({
        data,
        plc: {
            width: 200,
            align: 'left',
            init: true,
            order: 5,
        },
        hide: {
            name: false,
            star: false,
        },
        fixed: {
            colorFixedLeft: false,
            nameFixedLeft: false,
        },
        config(items: any) {
            return {
                'size_大小': {
                    width: 60,
                }
            }
        },
    })


    return () => (
        <div>
            <DemoRow title={'属性控制'}>
                <PlForm>
                    <PlFormItem label={'列宽（大小）'}>
                        <PlNumber v-model={state.plc.width} step={30}/>
                    </PlFormItem>
                    <PlFormItem label={'隐藏列'}>
                        <PlCheckbox label={'隐藏名称'} v-model={state.hide.name} width={'50%'}/>
                        <PlCheckbox label={'隐藏评分'} v-model={state.hide.star} width={'50%'}/>
                    </PlFormItem>
                    <PlFormItem title={'固定'}>
                        <PlCheckbox label={'颜色左固定'} v-model={state.fixed.colorFixedLeft} width={'50%'}/>
                        <PlCheckbox label={'名称左固定'} v-model={state.fixed.nameFixedLeft} width={'50%'}/>
                    </PlFormItem>
                </PlForm>
            </DemoRow>
            <DemoRow title={'不分组'}>
                <PlTable config={state.config} data={data}>
                    <Plc field={'id'} title={'编号'} width={"200px"}/>
                    {/*这里虽然通过props设置了宽度，但是因为 在config 中也配置了这一列的宽度，所以这里配置的不生效*/}
                    <Plc field={'size'} title={'大小'} width={state.plc.width}/>
                    <Plc field={'date'} title={'日期'}/>
                    <Plc field={'color'} title={'颜色'} fixed={state.fixed.colorFixedLeft ? 'left' : 'center'}/>
                    <Plc field={'name'} title={'名称'} hide={state.hide.name} fixed={state.fixed.nameFixedLeft ? 'left' : 'center'}/>
                    <Plc field={'star'} title={'评分'} hide={state.hide.star}/>
                </PlTable>
            </DemoRow>
            <DemoRow title={'分组'}>
                <PlTable data={data}>
                    <Plc field={'id'} title={'编号'} width={"200px"}/>
                    <PlcGroup title={'第一组'}>
                        <Plc field={'size'} title={'大小'} width={state.plc.width}/>
                        <Plc field={'date'} title={'日期'}/>
                    </PlcGroup>
                    <Plc field={'color'} title={'颜色'} fixed={state.fixed.colorFixedLeft ? 'left' : 'center'}/>
                    <PlcGroup title={'第二组'}>
                        <Plc field={'name'} title={'名称'} hide={state.hide.name} fixed={state.fixed.nameFixedLeft ? 'left' : 'center'}/>
                        <Plc field={'star'} title={'评分'} hide={state.hide.star}/>
                    </PlcGroup>
                </PlTable>
            </DemoRow>
        </div>
    )
})