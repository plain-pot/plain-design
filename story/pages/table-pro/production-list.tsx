import {designPage} from "plain-design-composition";
import React from "react";
import {PlcImage, PlcOv, PlcInput, PlTablePro, useTableOption} from "../../../src";
import {DemoRow} from "../../components/DemoRow";

export const demo1 = designPage(() => {

    const prodOption = useTableOption({
        // url: '/prod',
        url: 'http://1.116.13.72:7001/prod',
        showRows: 5,
        bodyRowHeight: 80,
    })

    return () => (
        <div>
            <DemoRow>
                <PlTablePro option={prodOption}>
                    <PlcImage title="产品图片" field="imgPath" imgKeyField="imgId"/>
                    <PlcInput title="产品名称" field="name"/>
                    <PlcOv title="产品类型" field="type" ov="prod_type"/>
                </PlTablePro>
            </DemoRow>
        </div>
    )
})