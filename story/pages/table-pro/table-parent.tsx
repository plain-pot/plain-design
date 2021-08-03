import {designPage} from "plain-design-composition";
import React from "react";
import useTableOption from "../../init/useTableOption";
import {PlcInput, PlTablePro} from "../../../src";
import {DemoRow} from "../../components/DemoRow";

export const demo1 = designPage(() => {

    const provinceOption = useTableOption({
        url: '/address',
        filterParam: {queries: [{field: 'deep', value: '0', operator: '='}]},
        showRows: 5,
    })

    const cityOption = useTableOption({
        url: '/address',
        filterParam: {queries: [{field: 'deep', value: '0', operator: '='}]},
        showRows: 5,
    })

    const districtOption = useTableOption({
        url: '/address',
        filterParam: {queries: [{field: 'deep', value: '0', operator: '='}]},
        showRows: 5,
    })


    return () => <>
        <DemoRow title="基本用法">
            <PlTablePro option={provinceOption}>
                <PlcInput title="地址代码" field="code"/>
                <PlcInput title="地址名称" field="name"/>
                <PlcInput title="经度" field="longitude"/>
                <PlcInput title="纬度" field="latitude"/>
            </PlTablePro>
        </DemoRow>
    </>

})
