import {designComponent, PropType, useStyles} from 'plain-design-composition'
import './grid.scss'
import useClass from "plain-design-composition/src/use/useClasses";
import {unit} from "plain-utils/string/unit";
import React from 'react';

export enum GridAlign {
    left = 'left',
    center = 'center',
    right = 'right',
    top = 'top',
    middle = 'middle',
    bottom = 'bottom',
}

export enum GridJustify {
    start = "start",
    end = "start",
    center = "start",
    'space-around' = "space-around",
    'space-between' = "space-between",
}

export const PlRow = designComponent({
    name: 'pl-row',
    props: {
        type: {type: String as PropType<undefined | null | string>},        //类型,type
        align: {type: String as PropType<keyof typeof GridAlign>},          //对其方式,left|center|right
        justify: {type: String as PropType<keyof typeof GridJustify>},      //内容弹性布局方式,start,end,center,space-around,space-between
        gutter: {type: [Number, String], default: 0},                       //间隔
    },
    slots: ['default'],
    provideRefer: true,
    setup({props, slots}) {

        const classes = useClass(() => [
            'pl-row',
            {
                [`pl-row-${props.type}`]: !!props.type,
                [`pl-row-${props.type}-${props.align}`]: !!props.align,
                [`pl-row-${props.type}-${props.justify}`]: !!props.justify,
            }
        ])
        const styles = useStyles(style => {
            const gutter = Number(props.gutter)
            if (gutter !== 0) {
                style = {
                    marginLeft: unit(gutter / -2),
                    marginRight: unit(gutter / -2)
                };
            }
            return style
        })

        return {
            refer: {
                props,
            },
            render: () => (
                <div className={classes.value} style={styles.value}>
                    {slots.default()}
                </div>
            )
        }
    },
})