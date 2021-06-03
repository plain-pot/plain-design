import {designPage} from "plain-design-composition";
import React from "react";
import {useTableOption} from "./useTableOption";
import PlTablePro from "../../../src/packages/PlTablePro";
import {PlSelectOption, Plc, PlIcon} from "../../../src";
import {PlcSelect} from "../../../src/packages/PlcSelect";
import {PlcCheckbox} from "../../../src/packages/PlcCheckbox";
import {PlcNumber} from "../../../src/packages/PlcNumber";
import {PlcInput} from "../../../src/packages/PlcInput";
import {TableRenderScope} from "../../../src/packages/PlTable/plc/utils/plc.type";
import PlcTextarea from "../../../src/packages/PlcTextarea";

export default designPage(() => {

    const option = useTableOption({
        title: '示例列表',
        url: '/demo',
        editType: 'form',
        defaultNewRow: {
            count: 100
        },
    })

    const onClick = (data: { e: React.MouseEvent, scope: TableRenderScope }) => {
        console.log({...data.scope.row})
    }

    return () => <>
        <div style={{height: '100%', boxSizing: 'border-box', backgroundColor: 'white'}}>
            <PlTablePro option={option}>
                <Plc title="编号id" field="id" width={350} link onClick={onClick}/>
                <PlcNumber title="计数count" field="count" required/>
                <PlcInput title="文本normalText" field="normalText" required/>
                <PlcNumber title="数字numberVal" field="numberVal" required/>
                <PlcCheckbox title="复选框flag" field="flag"/>
                <PlcSelect title="下拉框selectVal" field="selectVal">
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
                <PlcTextarea title="长文本longText" field="longText" required/>
            </PlTablePro>
        </div>
    </>
})