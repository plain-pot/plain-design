import {designPage} from "plain-design-composition";
import React from "react";
import useTableOption from "../../init/useTableOption";
import {PlcInput, PlTablePro} from "../../../src";
import {DemoRow} from "../../components/DemoRow";
import {PlainObject} from "../../../src/packages/createUseTableOption/createUseTableOption.utils";

export const demo1 = designPage(() => {

    const option = useTableOption({
        url: '/address',
        enable: {
            insert: false,
            update: false,
        },
    })

    return () => <>
        <DemoRow title="基本用法">
            <PlTablePro option={option}>
                <PlcInput title="地址代码" field="code" required/>
                <PlcInput title="地址名称" field="name" required defaultSearch/>
                <PlcInput title="经度" field="longitude"/>
                <PlcInput title="纬度" field="latitude"/>
                <PlcInput title="层级" field="deep"/>
                <PlcInput title="父级地址名称" field="parentName"/>
                <PlcInput title="父级地址代码" field="parentCode"/>
            </PlTablePro>
        </DemoRow>
    </>

})
