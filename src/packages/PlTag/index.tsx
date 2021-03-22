import {designComponent} from "plain-design-composition";
import {EditProps, useEdit} from "../../use/useEdit";
import {DEFAULT_STATUS, StyleProps, useStyle} from "../../use/useStyle";
import useClass from "plain-design-composition/src/use/useClasses";
import PlIcon from "../PlIcon";
import React from "react";
import {createEventListener} from "plain-design-composition/src/utils/createEventListener";
import './tag.scss'

export const PlTag = designComponent({
    name: 'pl-tag',
    props: {
        ...EditProps,
        ...StyleProps,
        mode: {type: String, default: 'stroke'},
        label: {type: String},
        close: {type: Boolean},
    },
    emits: {
        onClick: (e: MouseEvent) => true,
        onClose: (e: MouseEvent) => true,
    },
    slots: ['default'],
    setup({props, slots, event: {emit}}) {
        const {editComputed} = useEdit()
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const classes = useClass(() => ([
            `pl-tag`,
            `pl-tag-mode-${props.mode}`,
            `pl-tag-status-${styleComputed.value.status}`,
            `pl-tag-shape-${styleComputed.value.shape}`,
            `pl-tag-size-${styleComputed.value.size}`,
            {
                'pl-tag-disabled': !!editComputed.value.disabled,
            },
        ]))

        const handler = {
            click: (e: React.MouseEvent) => {
                if (!editComputed.value.editable) {
                    return
                }
                emit.onClick(e.nativeEvent)
            },
            clickClose: (e: React.MouseEvent) => {
                e.stopPropagation()
                if (!editComputed.value.editable) {
                    return
                }
                emit.onClose(e.nativeEvent)
            }
        }

        return {
            render: () => (
                <div className={classes.value} onClick={handler.click}>
                    {slots.default(props.label)}
                    {!!props.close && <PlIcon icon="el-icon-close" className="pl-tag-close" {...createEventListener({onClick: handler.clickClose})}/>}
                </div>
            )
        }
    },
})

export default PlTag