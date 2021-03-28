import {designComponent, reactive} from "plain-design-composition";
import React from "react";
import './TestGroupTransition.scss'
import 'antd/dist/antd.css'
import {NativeInput} from "../../../src/packages/NativeInput";

const DesignPage = designComponent({
    setup() {

        const state = reactive({
            text: 'hello world' as string | undefined
        })

        return () => (
            <div className={'test-page'}>
                <div>
                    {state.text || 'nothing'}
                </div>
                <NativeInput v-change={state.text}/>
                <NativeInput v-change={state.text}/>
            </div>
        )
    },
})

// export default FcPage
export default DesignPage