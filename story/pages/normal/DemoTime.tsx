import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import PlTime from "../../../src/packages/PlTime";
import {reactive} from "@vue/reactivity";
import PlButton from "../../../src/packages/PlButton";
import {DemoLine} from "../../components/DemoLine";
import {PlInput} from "../../../src/packages/PlInput";

export default designPage(() => {

    const val = reactive({val: {} as any}).val
    const setTime = () => val[18] = PlTime.plainDate.today('HH:mm:ss', 'HH:mm:ss').getValue()

    return () => (
        <div>
            <DemoRow title={'额外内容'}>
                <DemoLine>{val[18]}</DemoLine>
                <PlTime
                    v-model={val[18]}
                    foot={<PlButton mode={'text'} size={'mini'} onClick={setTime} label={'现在'}/>}
                />
                <PlInput style={{display: 'block'}}/>
            </DemoRow>
            <DemoRow title={'获取焦点'}>
                <PlTime onFocus={() => console.log('focus')} onBlur={() => console.log('blue')}/>
                <PlTime onFocus={() => console.log('focus')} onBlur={() => console.log('blue')} range/>
            </DemoRow>
            <DemoRow title={'基本用法'}>
                <DemoLine>{val[0]}</DemoLine>
                <PlTime v-model={val[0]}/>
                <PlTime v-model={val[0]}/>
            </DemoRow>
        </div>
    )
})