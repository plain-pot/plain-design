import {designClassComponent, PropType} from 'plain-design-composition'
import './PlMessage.scss'
import {MessageServiceFormatOption} from "./index";
import {useClasses} from "plain-design-composition";
import {nextIndex} from "plain-design-composition"
import React from 'react';
import {PlIcon} from "../PlIcon";
import {createEventListener} from "plain-design-composition"

export default designClassComponent({
    name: 'pl-message',
    props: {
        option: {type: Object as PropType<MessageServiceFormatOption>, required: true}
    },
    emits: {
        onClose: () => true
    },
    setup({props, event: {emit}}) {

        const classes = useClasses(() => [
            'pl-message',
            `pl-message-status-${props.option.status}`
        ])
        const styles = {zIndex: nextIndex()}

        const close = () => {
            emit.onClose()
            !!props.option.onClose && props.option.onClose()
        }

        props.option.close = close

        const handler = {
            onClick: (e: React.MouseEvent<HTMLDivElement>) => {
                !!props.option.onClick && props.option.onClick(e.nativeEvent)
            },
            onClickCloseIcon: () => {
                close()
            },
            onMouseenter: () => {
                if (!!closeTimer) {
                    clearTimeout(closeTimer)
                }
            },
            onMouseleave: () => {
                !!props.option.time && (closeTimer = setTimeout(close, props.option.time) as any)
            }
        }

        let closeTimer: number | null = null
        !!props.option.time && (closeTimer = setTimeout(close, props.option.time) as any)

        return {
            refer: {
                props,
            },
            render: () => (
                <div className={classes.value}
                     style={styles}
                     onMouseEnter={handler.onMouseenter}
                     onMouseLeave={handler.onMouseleave}
                     onClick={handler.onClick}>
                    {!!props.option.icon && <PlIcon icon={props.option.icon}/>}
                    <div className="pl-message-content">{!!props.option.render ? props.option.render() : props.option.message}</div>
                    <PlIcon icon="el-icon-close" className="pl-message-close" {...createEventListener({onClick: handler.onClickCloseIcon})}/>
                </div>
            )
        }
    },
})