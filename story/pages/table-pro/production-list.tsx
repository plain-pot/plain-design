import {designPage} from "plain-design-composition";
import React from "react";
import {PlcOv, PlcInput, PlTablePro, useTableOption} from "../../../src";
import {DemoRow} from "../../components/DemoRow";

export const demo1 = designPage(() => {

    const prodOption = useTableOption({
        url: '/prod',
        showRows: 5,
        bodyRowHeight: 70,
    })

    return () => (
        <div>
            <DemoRow>
                <PlTablePro option={prodOption}>
                    <PlcInput title="产品名称" field="name"/>
                    <PlcOv title="产品类型" field="type" ov="prod_type"/>
                </PlTablePro>
            </DemoRow>
        </div>
    )
})