import {designComponent, useRefs, onBeforeUpdate, onUpdated, reactive} from "plain-design-composition";
import React from "react";
import './TestGroupTransition.scss'
import {PlButton} from "../../../src/packages/PlButton";
import FlipMove from "react-flip-move";
import {shuffle} from 'plain-utils/object/shuffle'

const List = designComponent({
    slots: ['default'],
    setup({slots}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })

        onBeforeUpdate(() => {
            if (!refs.el) return
            console.log('before update')
            console.log(refs.el!.childNodes)
        })

        onUpdated(() => {
            console.log('update')
            console.log(refs.el!.childNodes)
        })

        return () => (
            <div ref={onRef.el}>
                {slots.default()}
            </div>
        )
    },
})

const Item = designComponent({
    slots: ['default'],
    setup({slots}) {
        return () => (
            <div>
                {slots.default()}
            </div>
        )
    },
})

export default designComponent({
    setup() {

        let count = 0;
        const state = reactive({
            data: [
                '上海',
                '北京',
                '广州',
                '深圳',
                '杭州',
                '天津',
                '苏州',
                '厦门',
                '香港'
            ],
        })

        return () => (
            <div>
                <h1>测试队列动画</h1>
                <PlButton label={'打乱数组'} onClick={() => state.data = shuffle(state.data)}/>
                <FlipMove typeName={'div'} className={"test-move"} {...{
                    children: state.data.map((item, index) => (
                        <div className={'test-item'} key={item}>
                            <span>{item}</span>
                            <PlButton label={'add'} onClick={() => state.data.splice(index, 0, item + (count++))}/>
                            <PlButton label={'remove'} onClick={() => state.data.splice(index, 1)}/>
                        </div>
                    ))
                } as any}/>
            </div>
        )
    },
})