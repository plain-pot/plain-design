import {designPage} from "plain-design-composition";
import React from "react";
import {PlcAddress, PlcObject, useTableOption} from "../../../src";
import PlTablePro from "../../../src/packages/PlTablePro";
import {PlcDate, PlSelectOption, Plc, PlIcon} from "../../../src";
import {PlcSelect} from "../../../src/packages/PlcSelect";
import {PlcCheckbox} from "../../../src/packages/PlcCheckbox";
import {PlcNumber} from "../../../src/packages/PlcNumber";
import {PlcInput} from "../../../src/packages/PlcInput";
import {TableRenderScope} from "../../../src/packages/PlTable/plc/utils/plc.type";
import PlcTextarea from "../../../src/packages/PlcTextarea";
import useObjectOption from "../../init/useObjectOption";

export default designPage(() => {

    const option = useTableOption({
        title: '选项值',
        url: '/ov',
    })

    return () => <>
        <div style={{height: '100%', boxSizing: 'border-box', backgroundColor: 'white'}}>
            <PlTablePro option={option}>
                <PlcInput title="显示值" field="name"/>
                <PlcInput title="代码" field="code"/>
                <PlcInput title="类型" field="type"/>
                <PlcDate title="创建时间" field="createdAt" hideInForm width={180} editable={false} datetime/>
                <PlcInput title="说明" field="comment"/>
            </PlTablePro>
        </div>
    </>
})
