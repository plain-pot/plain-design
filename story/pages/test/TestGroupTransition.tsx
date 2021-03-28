import {designComponent, onMounted, reactive, useRefs} from "plain-design-composition";
import React from "react";
import './TestGroupTransition.scss'
import 'antd/dist/antd.css'
import {NativeInput} from "../../../src/packages/NativeInput";
import {NativeTextarea} from "../../../src/packages/NativeTextarea";

const DesignPage = designComponent({
    setup() {

        const state = reactive({
            text: 'hello world' as string | undefined
        })

        const {refs, onRef} = useRefs({
            input1: HTMLInputElement,
            input2: HTMLInputElement,
            input3: HTMLTextAreaElement,
        })

        return () => (
            <div className={'test-page'}>
                <div>
                    {state.text || 'nothing'}
                </div>
                <NativeInput v-change={state.text} ref={onRef.input1}/>
                <NativeInput v-change={state.text} ref={onRef.input2}/>
                <NativeTextarea v-change={state.text} ref={onRef.input3}/>
                <div>
                    <button onClick={() => {
                        console.log(refs)
                        refs.input3!.focus()
                    }}>focus
                    </button>
                </div>
            </div>
        )
    },
})

// export default FcPage
export default DesignPage