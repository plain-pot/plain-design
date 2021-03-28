import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {DemoLine} from "../../components/DemoLine";
import {reactive} from "@vue/reactivity";
import {PlSelect} from "../../../src/packages/PlSelect";
import {PlSelectOption} from "../../../src/packages/PlSelectOption";

export default designPage(() => {

    const val = reactive({val: {} as any}).val

    const list = [
        {name: '春节', val: 'Chun'},
        {name: '万圣节', val: 'WanSheng'},
        {name: '青年节', val: 'QinNian'},
        {name: '中年节', val: 'ZhongNian', isDisabled: true,},
        {name: '国庆节', val: 'GuoQing', isDisabled: true,},
        {name: '中秋节', val: 'ZhongQiu', isDisabled: true,},
        {name: '劳动节', val: 'LaoDong', isDisabled: true,},
        {name: '圣诞节', val: 'ShengDan'},
        {name: '儿童节', val: 'ErTong'},
        {name: '妇女节', val: 'FuNv'},
        {name: '教师节', val: 'JiaoShi'},
        {name: '清明节', val: 'QingMing'},
    ]

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <DemoLine>{val[3]}</DemoLine>
                <PlSelect v-model={val[3]}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
                <PlSelect v-model={val[3]}>
                    {list.map(item => <PlSelectOption key={item.name} val={item.val} label={item.name}/>)}
                </PlSelect>
            </DemoRow>
        </div>
    )
})