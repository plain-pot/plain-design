import {designComponent, reactive} from "plain-design-composition";
import React from "react";


const List = designComponent({
    slots: ['default'],
    setup({slots}) {
        return () => (
            <div>
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
                <List>
                    {state.data.map(item => (
                        <Item key={item}>
                            {item}
                        </Item>
                    ))}
                </List>
            </div>
        )
    },
})