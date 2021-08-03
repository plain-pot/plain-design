import {designPage} from "plain-design-composition";
import React from "react";
import useTableOption from "../../init/useTableOption";
import {PlcInput, PlTablePro} from "../../../src";
import {DemoRow} from "../../components/DemoRow";
import {PlainObject} from "../../../src/packages/createUseTableOption/createUseTableOption.utils";

export const demo1 = designPage(() => {

    // todo code唯一性校验
    // const http = useHttp()
    const checkNewCode = (row: PlainObject) => {
        const {code} = row
    }

    const provinceOption = useTableOption({
        url: '/address',
        filterParam: {queries: [{field: 'deep', value: '0', operator: '='}]},
        defaultNewRow: {deep: 0,},
        showRows: 5,
    })

    const cityOption = useTableOption({
        url: '/address',
        showRows: 5,
        defaultNewRow: {deep: 1,},
        parentOption: provinceOption,
        parentMap: {parentName: 'name', parentCode: 'code'},
    })

    const districtOption = useTableOption({
        url: '/address',
        showRows: 5,
        defaultNewRow: {deep: 2,},
        parentOption: cityOption,
        parentMap: {parentName: 'name', parentCode: 'code'},
    })


    return () => <>
        <DemoRow title="基本用法">
            <PlTablePro option={provinceOption}>
                <PlcInput title="地址代码" field="code" required/>
                <PlcInput title="地址名称" field="name" required defaultSearch/>
                <PlcInput title="经度" field="longitude"/>
                <PlcInput title="纬度" field="latitude"/>
            </PlTablePro>
            <PlTablePro option={cityOption}>
                <PlcInput title="地址代码" field="code" required/>
                <PlcInput title="地址名称" field="name" required defaultSearch/>
                <PlcInput title="经度" field="longitude"/>
                <PlcInput title="纬度" field="latitude"/>
                {/*<PlcInput title="父级地址名称" field="parentName"/>*/}
                {/*<PlcInput title="父级地址代码" field="parentCode"/>*/}
            </PlTablePro>
            <PlTablePro option={districtOption}>
                <PlcInput title="地址代码" field="code" required/>
                <PlcInput title="地址名称" field="name" required defaultSearch/>
                <PlcInput title="经度" field="longitude"/>
                <PlcInput title="纬度" field="latitude"/>
                {/*<PlcInput title="父级地址名称" field="parentName"/>*/}
                {/*<PlcInput title="父级地址代码" field="parentCode"/>*/}
            </PlTablePro>
        </DemoRow>
    </>

})
