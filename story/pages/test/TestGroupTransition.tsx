import {designComponent, reactive} from "plain-design-composition";
import React from "react";
import './TestGroupTransition.scss'
import {PlButton} from "../../../src/packages/PlButton";
import PlCollapseTransition from "../../../src/packages/PlCollapseTransition";

export default designComponent({
    setup() {

        const state = reactive({
            show: true,
        })

        return () => (
            <div>
                <h1>测试队列动画</h1>
                <PlButton label={state.show ? 'hide' : 'show'} onClick={() => state.show = !state.show}/>
                <PlCollapseTransition show={state.show}>
                    <div style={{height: '300px', color: 'white', backgroundColor: 'blueviolet'}}>
                        this is content
                    </div>
                </PlCollapseTransition>
            </div>
        )
    },
})