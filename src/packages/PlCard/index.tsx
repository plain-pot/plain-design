import './card.scss'
import {designComponent, useStyles} from "plain-design-composition";
import useClass from "plain-design-composition/src/use/useClasses";
import {unit} from "plain-utils/string/unit";
import React from 'react';

export const PlCard = designComponent({
    name: 'pl-card',
    props: {
        width: {type: [String, Number], default: '300'},        // 卡片宽度
        noPadding: {type: Boolean},                             // 去掉标题以及内容的内边距
        mini: {type: Boolean},                                  // 小型卡片
        shadow: {type: String},                                 // 阴影, normal,hover
    },
    slots: [
        'title',
        'desc',
        'default',
        'operator',
        'poster',
        'foot',
    ],
    setup({props, event: {emit}, slots}) {

        const classes = useClass(() => [
            'pl-card',
            {
                'pl-card-mini': props.mini,
                'pl-card-no-padding': props.noPadding,
                [`pl-card-shadow-${props.shadow}`]: !!props.shadow,
            }
        ])

        const styles = useStyles(style => {
            !!props.width && (style.width = unit(props.width))
        })

        console.log(slots.title())
        return {
            render: () => (
                <div className={classes.value} style={styles.value}>
                    {slots.poster.isExist() && <div className="pl-card-poster">
                        {slots.poster()}
                    </div>}
                    {(slots.title.isExist() || slots.desc.isExist() || slots.operator.isExist()) && (
                        <div className="pl-card-head">
                            <div className="pl-card-head-content">
                                {slots.title.isExist() && <div className="pl-card-title">
                                    {slots.title()}
                                </div>}
                                {(slots.desc.isExist()) && <div className="pl-card-desc">
                                    {slots.desc()}
                                </div>}
                            </div>
                            {slots.operator.isExist() && <div className="pl-card-head-operator">
                                {slots.operator()}
                            </div>}
                        </div>
                    )}
                    {slots.default.isExist() && <div className="pl-card-content">
                        {slots.default()}
                    </div>}
                    {slots.foot.isExist() && <div className="pl-card-foot">
                        {slots.foot()}
                    </div>}
                </div>
            )
        }
    },
})

export default PlCard