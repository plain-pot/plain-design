import {designPage} from "plain-design-composition";
import {DemoRow} from "../../components/DemoRow";
import {reactive} from "@vue/reactivity";
import React from "react";
import {PlInput} from "../../../src/packages/PlInput";
import {DemoLine} from "../../components/DemoLine";
import {$$message} from "../../../src";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";
import {delay} from "plain-utils/utils/delay";
import {StoryStatus} from "../../story.utils";

export default designPage(() => {

    const state = reactive({
        val: {
            2: '一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，一段很长很长的文本，'
        } as any,
        passwordVisible: true,
    })

    const asyncHandler = async (e: any) => {
        $$message('async task start')
        await delay(3000)
        if (Math.random() > 0.5) {
            $$message.error('async task error')
            throw new Error('异步任务出错')
        } else {
            console.log(e)
            $$message.success('async task end')
        }
    }

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
                <DemoRow title={'enter 按键事件节流'}>
                    <PlInput placeholder={'1000ms'} onEnter={() => $$message(String(Date.now()))} throttleEnter/>
                    <PlInput placeholder={'500ms'} onEnter={() => $$message(String(Date.now()))} throttleEnter={500}/>
                </DemoRow>

                <DemoRow title={'自动处理loading状态(当异步任务开始时开启loading，结束时关闭loading)'}>
                    <PlInput placeholder={'异步任务'} asyncHandler={asyncHandler} suffixIcon={'el-icon-view'} clearIcon/>
                </DemoRow>

                <DemoRow title={'禁用'}>
                    <PlCheckbox label={'是否禁用'} v-model={state.val.flag2}/>
                    <PlInput disabled={state.val.flag2}/>
                    <PlInput disabled={state.val.flag2} suffixIcon={'el-icon-search'}/>
                    <PlInput disabled={state.val.flag2} textarea style={{verticalAlign: 'bottom'}}/>
                </DemoRow>

                <DemoRow title={'状态'}>
                    <DemoLine title={'input'}>
                        {StoryStatus.map(item => <PlInput status={item.status} key={item.status}/>)}
                    </DemoLine>
                    <DemoLine title={'textarea'}>
                        {StoryStatus.map(item => <PlInput status={item.status} key={item.status} textarea/>)}
                    </DemoLine>
                </DemoRow>

                <DemoRow title={'清除图标'}>
                    <DemoLine title={'基本用法'}>
                        <PlInput clearIcon onClickClearIcon={() => $$message('on click clear')}/>
                    </DemoLine>
                    <DemoLine title={'自定义清除逻辑'}>
                        <PlInput clearIcon onClickClearIcon={() => $$message('on click clear')} clearHandler={() => $$message.success('自定义处理清除逻辑')}/>
                    </DemoLine>
                    <DemoLine title={'带前置图标'}>
                        <PlInput prefixIcon={'el-icon-search'}
                                 clearIcon
                                 onClickClearIcon={() => $$message('on click clear')}
                                 onClickPrefixIcon={() => $$message('prefix')}
                        />
                    </DemoLine>
                    <DemoLine title={'带后置图标'}>
                        <PlInput prefixIcon={'el-icon-search'}
                                 suffixIcon={'el-icon-search'}
                                 clearIcon
                                 onClickClearIcon={() => $$message('on click clear')}
                                 onClickPrefixIcon={() => $$message('prefix')}
                                 onClickSuffixIcon={() => $$message('suffix')}
                        />
                    </DemoLine>
                </DemoRow>

                <DemoRow title={'加载状态'}>
                    <DemoLine title={'loading'}>
                        <PlInput clearIcon suffixIcon={'el-icon-full-screen'} loading v-model={state.val[0]}/>
                    </DemoLine>
                    <DemoLine title={'input'}>
                        <PlInput clearIcon suffixIcon={'el-icon-full-screen'} v-model={state.val[0]}/>
                    </DemoLine>
                    <span>{state.val[0]}</span>
                </DemoRow>

                <DemoRow title={'块级元素'}>
                    <PlInput block style={{marginBottom: '12px'}}/>
                    <PlInput block textarea/>
                </DemoRow>

                <DemoRow title={'设置宽度'}>
                    <DemoLine title={'300'}><PlInput width={300}/></DemoLine>
                    <DemoLine title={'300px'}><PlInput width={'300px'}/></DemoLine>
                </DemoRow>

                <DemoRow title={'输入框组'}>

                </DemoRow>

                <DemoRow title={'自定义内容'}>
                    <PlInput suffixIcon={'el-icon-search'}>
                        <span>自定义内容</span>
                    </PlInput>
                </DemoRow>

                <DemoRow title={'大小'}>
                    <PlInput size={'large'}/>
                    <PlInput size={'normal'}/>
                    <PlInput size={'mini'}/>
                </DemoRow>

                <DemoRow title={'形状'}>
                    <PlInput shape={'fillet'}/>
                    <PlInput shape={'round'}/>
                    <PlInput shape={'square'}/>
                </DemoRow>

                <DemoRow title={'文本域输入框'}>
                    <PlInput textarea/>
                </DemoRow>

                <DemoRow title={'文本域输入框：自适应高度'}>
                    <DemoLine title={'基本用法'}>
                        <PlInput textarea autoHeight width={300} v-model={state.val[2]}/>
                    </DemoLine>
                    <DemoLine title={'去掉最大高度'}>
                        <PlInput textarea autoHeight width={300} v-model={state.val[2]} maxHeight={null}/>
                    </DemoLine>
                </DemoRow>

                <DemoRow title={'密码输入框'}>
                    <PlInput suffixIcon={state.passwordVisible ? 'el-icon-view-not-s' : 'el-icon-view'}
                             onClickSuffixIcon={() => state.passwordVisible = !state.passwordVisible}
                             nativeAttrs={{type: state.passwordVisible ? 'text' : 'password'}}
                    />
                </DemoRow>

                <DemoRow title={'禁用以及只读'}>
                    <PlCheckbox label={'是否禁用/只读'} v-model={state.val.flag3}/>
                    <PlInput readonly={state.val.flag3}/>
                    <PlInput disabled={state.val.flag3}/>
                    <input type="text" readOnly={state.val.flag3}/>
                </DemoRow>
            </div>
        )
    }
})