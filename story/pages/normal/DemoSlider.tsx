import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import PlSlider from "../../../src/packages/PlSlider";
import {reactive} from "plain-design-composition";
import PlButton from "../../../src/packages/PlButton";
import {DemoLine} from "../../components/DemoLine";
import {PlCheckbox} from "../../../src/packages/PlCheckbox";

export default designPage(() => {

    const state = reactive({
        val: {
            0: 20,
            1: 50,
            2: 50,
            4: 30,
            5: 20,
            6: 80
        } as any,
    })

    return () => (
        <div>
            <DemoRow title={'基本用法'}>
                <PlSlider v-model={state.val[0]}/>
                {state.val[0]}
            </DemoRow>
            <DemoRow title={'横向纵向，以及对齐方式'}>
                <PlSlider vertical v-model={state.val[1]}/>
                <PlSlider vertical alignEnd v-model={state.val[1]} onChange={(val) => console.log('change', val)}/>
                <PlSlider v-model={state.val[1]}/>
                <PlSlider v-model={state.val[1]} alignEnd/>
            </DemoRow>
            <DemoRow title={'状态'}>
                <PlSlider v-model={state.val[2]} status={'primary'}/>
                <PlSlider v-model={state.val[2]} status={'success'}/>
                <PlSlider v-model={state.val[2]} status={'warn'}/>
                <PlSlider v-model={state.val[2]} status={'error'}/>
                <PlSlider v-model={state.val[2]} status={'info'}/>
            </DemoRow>
            <DemoRow title={'设置总数'}>
                <PlSlider v-model={state.val[3]} total={1000}/>
            </DemoRow>

            <DemoRow title={'设置宽度'}>
                <PlSlider v-model={state.val[4]} length={'100px'}/>
                <PlSlider v-model={state.val[4]} length={'200px'}/>
                <PlSlider v-model={state.val[4]} length={'300px'}/>
                <PlSlider v-model={state.val[4]} full/>
            </DemoRow>
            <DemoRow title={'范围选择'}>
                <PlSlider range v-model-start={state.val[5]} v-model-end={state.val[6]} total={200} length={'300px'}/>
                <PlButton>start:{state.val[5]}</PlButton>
                <PlButton>end:{state.val[6]}</PlButton>
            </DemoRow>
            <DemoRow title={'禁用tooltip'}>
                <PlSlider tooltip={false}/>
            </DemoRow>
            <DemoRow title={'格式化tooltip'}>
                <PlSlider tooltipFormatter={val => `${val}%`}/>
            </DemoRow>
            <DemoRow title={'设置最大最小值'}>
                <PlSlider modelValue={50} max={80} min={40}/>
                <PlSlider range max={150} min={50} start={60} end={90} total={200}/>
            </DemoRow>
            <DemoRow title={'步骤分块'}>
                <PlSlider modelValue={50} step={10}/>
                <PlSlider range start={60} end={90} total={200} step={10}/>
            </DemoRow>
            <DemoRow title={'禁用与只读'}>
                <DemoLine><PlCheckbox label={'禁用/只读'} v-model={state.val[8]}/></DemoLine>
                <DemoLine>
                    <PlSlider modelValue={50} disabled={state.val[8]}/>
                    <PlSlider modelValue={50} readonly={state.val[8]}/>
                </DemoLine>
            </DemoRow>
        </div>
    )
})