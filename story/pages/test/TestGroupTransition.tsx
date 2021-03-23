import {designComponent, reactive, useRefs, watch} from "plain-design-composition";
import React, {useRef} from "react";
import './TestGroupTransition.scss'
import {PlButton} from "../../../src/packages/PlButton";
import PlCollapseTransition from "../../../src/packages/PlCollapseTransition";
import PlButtonGroup from "../../../src/packages/PlButtonGroup";
import {unit} from "plain-utils/string/unit";
import {addClass} from "plain-utils/dom/addClass";
import {delay} from "plain-utils/utils/delay";
import {removeClass} from "plain-utils/dom/removeClass";
import {SimpleFunction} from "plain-design-composition/src/composition/event";

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
                    <div>
                        <div style={{height: '300px', color: 'white', backgroundColor: 'blueviolet'}}>
                            this is content
                        </div>
                    </div>
                </PlCollapseTransition>
                <button>next</button>
            </div>
        )
    },
})