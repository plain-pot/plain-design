import {designPage} from "plain-design-composition";
import React from "react";
import {useTableOption} from "./useTableOption";
import PlTablePro from "../../../src/packages/PlTablePro";
import {PlSelectOption, Plc, PlIcon} from "../../../src";
import {PlcSelect} from "../../../src/packages/PlcSelect";
import {PlcCheckbox} from "../../../src/packages/PlcCheckbox";
import {PlcNumber} from "../../../src/packages/PlcNumber";
import {PlcInput} from "../../../src/packages/PlcInput";

export default designPage(() => {

    const option = useTableOption({
        title: '示例列表',
        url: '/demo',
        defaultNewRow: {
            count: 100
        },
    })

    return () => <>
        <div style={{height: '100%', boxSizing: 'border-box', backgroundColor: 'white'}}>
            <PlTablePro option={option}>
                <Plc title="id" field="id"/>
                <PlcNumber title="count" field="count" required/>
                <PlcInput title="normalText" field="normalText" required/>
                <PlcInput title="longText" field="longText"/>
                <PlcNumber title="numberVal" field="numberVal" required/>
                <PlcCheckbox title="flag" field="flag"/>
                <PlcSelect title="selectVal" field="selectVal">
                    <PlSelectOption label="消费者" val="consumer">
                        <PlIcon icon="el-icon-s-custom" status="primary"/>
                        <span>消费者</span>
                    </PlSelectOption>
                    <PlSelectOption label="潜在客户" val="potential">
                        <PlIcon icon="el-icon-place" status="info"/>
                        <span>潜在客户</span>
                    </PlSelectOption>
                    <PlSelectOption label="门店" val="store">
                        <PlIcon icon="el-icon-s-shop" status="error"/>
                        <span>门店</span>
                    </PlSelectOption>
                </PlcSelect>

            </PlTablePro>
        </div>
    </>
})