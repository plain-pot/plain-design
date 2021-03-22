import './badge.scss'
import {computed, designComponent} from "plain-design-composition";
import useClass from "plain-design-composition/src/use/useClasses";
import React from 'react';

export const PlBadge = designComponent({
    name: 'pl-badge',
    props: {
        data: {},                                       //显示的数据
        bottom: {type: Boolean},                        //标记纵向是否在底部
        start: {type: Boolean},                         //标记横向是否在右边
        status: {type: String, default: 'error'},       //标记背景色
        dot: {type: Boolean,},                          //标记是否只是一个小圆点
        max: {type: Number,},                           //标记显示文本最大值
    },
    slots: ['default', 'badge'],
    setup({props, slots}) {
        const contentClass = useClass(() => [
            'pl-badge-content',
            {
                'pl-badge-content-dot': !!props.dot,
            },
            `pl-badge-content-${!!props.bottom ? 'bottom' : 'top'}`,
            `pl-badge-content-${!!props.start ? 'start' : 'end'}`,
            `pl-badge-content-status-${props.status}`,
        ])
        const showValue = computed(() => {
            if (props.data == null) return null
            if (props.max != null && (Number(props.data)) > props.max) return props.max + '+'
            return props.data
        })
        return {
            render: () => (
                <div className="pl-badge">
                    {slots.default()}
                    <div className={contentClass.value}>
                        {slots.badge(props.data != null ? <span>{showValue.value as any}</span> : null)}
                    </div>
                </div>
            )
        }
    },
})

export default PlBadge