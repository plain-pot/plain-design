import {designComponent, reactive} from "plain-design-composition";
import React from "react";
import {DemoRow} from "../../components/DemoRow";
import {PlButton} from "../../../src/packages/PlButton/PlButton";
import {StoryStatus} from "../../story.utils";

export default designComponent({
    setup() {

        const state = reactive({
            show: true,
        })

        return {
            render: () => (
                <div>
                    <DemoRow title={"基本用法"}>
                        <button onClick={() => state.show = !state.show}>show button:{state.show}</button>
                        {!!state.show && <>
                            <PlButton label={"按钮"}/>
                            <span>普通文本</span>
                        </>}
                    </DemoRow>
                    <DemoRow title={'状态'}>
                        {StoryStatus.map(item => <PlButton status={item.status} key={item.status} label={item.label}/>)}
                    </DemoRow>
                </div>
            )
        }
    },
})