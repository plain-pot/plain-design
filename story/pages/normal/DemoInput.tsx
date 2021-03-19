import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "@vue/reactivity";
import React from "react";
import {PlInput} from "../../../src/packages/PlInput";
import {DemoLine} from "../../components/DemoLine";
import {$$message} from "../../../src";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const state = reactive({
        val: {} as any
    })

    return () => {
        return (
            <div>
                <DemoRow title={'基本用法'}>
                    <PlInput v-model={state.val[0]}/>
                    <PlInput v-model={state.val[0]}/>
                    {state.val[0]}
                </DemoRow>
                <DemoRow title={'前后图标'}>
                    <DemoLine>
                        <PlCheckbox label={'是否禁用/只读'} v-model={state.val.flag1}/>
                    </DemoLine>
                    <DemoLine title={'前置图标（禁用）'}>
                        <PlInput prefixIcon={'el-icon-search'} onClickPrefixIcon={() => $$message('prefix')} disabled={state.val.flag1}/>
                    </DemoLine>
                    <DemoLine title={'后置图标（只读）'}>
                        <PlInput suffixIcon={'el-icon-search'} onClickSuffixIcon={() => $$message('suffix')} readonly={state.val.flag1}/>
                    </DemoLine>
                    <DemoLine title={'前后置图标'}>
                        <PlInput prefixIcon={'el-icon-search'}
                                 suffixIcon={'el-icon-search'}
                                 onClickPrefixIcon={() => $$message('prefix')}
                                 onClickSuffixIcon={() => $$message('suffix')}
                                 disabled={state.val.flag1}
                        />
                    </DemoLine>
                </DemoRow>
            </div>
        )
    }
})