import {designComponent, PropType} from "plain-design-composition"
import {useClasses} from "plain-design-composition";
import {nextIndex} from "plain-design-composition"
import {NoticeServiceFormatOption} from "./index";
import React from "react";
import {PlIcon} from "../PlIcon";
import {PlButton} from "../PlButton";
import './PlNotice.scss'

export default designComponent({
    name: 'pl-notice',
    props: {
        option: {type: Object as PropType<NoticeServiceFormatOption>, required: true}
    },
    emits: {
        onClose: () => true
    },
    setup({props, event: {emit}}) {
        const classes = useClasses(() => [
            'pl-notice',
            `pl-notice-status-${props.option.status}`
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
            onClickCloseIcon: (e: React.MouseEvent) => {
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
                    <div className="pl-notice-head">
                        {!!props.option.icon && <PlIcon className="pl-notice-head-icon" icon={props.option.icon}/>}
                        {(!!props.option.renderHead || !!props.option.title) && (
                            <div className="pl-notice-title">
                                {!!props.option.renderHead ? props.option.renderHead() : props.option.title}
                            </div>
                        )}
                        {!props.option.noClose && (
                            <PlButton mode="text" icon="el-icon-close" className="pl-notice-close" onClick={handler.onClickCloseIcon}/>
                        )}
                    </div>
                    {(!!props.option.renderContent || !!props.option.message) && (
                        <div className="pl-notice-content">
                            {!!props.option.renderContent ? props.option.renderContent() : props.option.message}
                        </div>
                    )}
                    {!!props.option.renderFoot && (
                        <div className="pl-notice-foot">
                            {props.option.renderFoot()}
                        </div>
                    )}
                </div>
            )
        }
    },
})