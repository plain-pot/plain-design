import {designPage} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import PlTime from "../../../src/packages/PlTime";
import {reactive} from "@vue/reactivity";
import PlButton from "../../../src/packages/PlButton";
import {DemoLine} from "../../components/DemoLine";

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
            </DemoRow>
        </div>
    )
})