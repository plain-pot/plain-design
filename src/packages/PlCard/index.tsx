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
        title: {type: String},                                  // 卡片标题
        desc: {type: String},                                   // 卡片标题描述
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

        return {
            render: () => (
                <div className={classes.value} style={styles.value}>
                    {slots.poster.isExist() && <div className="pl-card-poster">
                        {slots.poster()}
                    </div>}
                    {(slots.title.isExist() || slots.desc.isExist() || slots.operator.isExist() || props.title || props.desc) && (
                        <div className="pl-card-head">
                            <div className="pl-card-head-content">
                                {(slots.title.isExist() || props.title) && <div className="pl-card-title">
                                    {slots.title(props.title)}
                                </div>}
                                {(slots.desc.isExist() || props.desc) && <div className="pl-card-desc">
                                    {slots.desc(props.desc)}
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