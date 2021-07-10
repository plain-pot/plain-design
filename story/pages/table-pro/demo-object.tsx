import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import useObject from "../../../src/packages/useObject";
import {useObjectOption} from "./useObjectOption";
import {PlcTextarea, $$notice, PlButton, Plc, PlcDate, PlcInput, PlcNumber, PlcSelect, PlIcon, PlSelectOption} from "../../../src";
import {PlcCheckbox} from "../../../src/packages/PlcCheckbox";

export default designPage(() => {

    const {$object} = useObject()

    const option = useObjectOption({
        title: '示例列表',
        url: '/demo',
        render: () => <>
            <Plc title="编号id" field="id" width={350} hideInForm/>
            <PlcDate title="创建时间" field="createdAt" hideInForm width={200}/>
            <PlcDate title="更新时间" field="updatedAt" hideInForm width={200}/>
            <PlcDate title="日期" field="dateVal"/>
            <PlcNumber title="计数count" field="count" required/>
            {/*<PlcInput title="文本normalText" field="normalText" required fixed="left"/>
            <PlcNumber title="数字numberVal" field="numberVal" required/>
            <PlcCheckbox title="复选框flag" field="flag"/>
            <PlcSelect title="下拉框selectVal" field="selectVal" required>
                <PlSelectOption label="消费者" val="consumer">
                    <PlIcon icon="el-icon-s-custom" status="primary" style={{marginRight: '4px'}}/>
                    <span>消费者</span>
                </PlSelectOption>
                <PlSelectOption label="潜在客户" val="potential">
                    <PlIcon icon="el-icon-place" status="info" style={{marginRight: '4px'}}/>
                    <span>潜在客户</span>
                </PlSelectOption>
                <PlSelectOption label="门店" val="store">
                    <PlIcon icon="el-icon-s-shop" status="error" style={{marginRight: '4px'}}/>
                    <span>门店</span>
                </PlSelectOption>
            </PlcSelect>
            <PlcTextarea title="长文本longText" field="longText" required/>*/}
        </>
    })

    const selectRow = async () => {
        const checked = await $object({option})
        $$notice({message: checked.normalText})
    }

    const selectList = async () => {
        const list = await $object({option}, true)
        $$notice({message: list.map(i => i.normalText).join(',')})
    }

    return () => <>
        <DemoRow title="基本用法">
            <PlButton onClick={selectRow} label="单选"/>
            <PlButton onClick={selectList} label="多选"/>
        </DemoRow>
    </>
})
