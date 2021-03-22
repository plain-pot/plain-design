import {computed, designComponent, reactive} from "plain-design-composition";
import {StyleProps, StyleStatus, useStyle} from "../../use/useStyle";
import {STATUS} from "../../utils/constant";
import useClass from "plain-design-composition/src/use/useClasses";
import React from "react";
import PlIcon from "../PlIcon";
import './alert.scss'

const PlCollapseTransition = (props: any) => props.children

export const PlAlert = designComponent({
    name: 'pl-alert',
    props: {
        ...StyleProps,

        label: {type: String},                                      // 提示文本
        desc: {type: String},                                       // 描述文本
        align: {type: String, default: 'left'},                     // 文本对其方式
        theme: {type: String, default: 'lite'},                     // 主题，lite轻色，deep深色
        noClose: {type: Boolean},                                   // 禁用关闭
        icon: {type: String, default: undefined},                   // 显示的图标
    },
    slots: ['desc', 'close', 'default'],
    setup({props, slots}) {

        const state = reactive({
            isClosed: false,
        })

        const {styleComputed} = useStyle({status: StyleStatus.info})

        const icon = computed(() => {
            if (props.icon === null) {
                return null
            }
            return props.icon || STATUS[styleComputed.value.status!].icon
        })
        const classes = useClass(() => [
            'pl-alert',
            `pl-alert-status-${styleComputed.value.status}`,
            `pl-alert-shape-${styleComputed.value.shape}`,
            `pl-alert-theme-${props.theme}`,
            `pl-alert-align-${props.align}`,
            {
                'pl-alert-has-icon': !!icon.value,
                'pl-alert-has-desc': !!props.desc || slots.desc.isExist(),
                'pl-alert-has-close': !props.noClose,
            }
        ])

        const handler = {
            onClickClosed: () => {
                state.isClosed = true
            }
        }

        return {
            render: () => (
                <PlCollapseTransition>
                    {!state.isClosed && <div className="pl-alert-wrapper">
                        <div className={classes.value}>
                            {!!icon.value && <div className="pl-alert-icon">
                                <PlIcon icon={icon.value}/>
                            </div>}
                            {!props.noClose && <div className="pl-alert-close" onClick={handler.onClickClosed}>
                                {slots.close(<PlIcon icon="el-icon-close"/>)}
                            </div>}
                            {(!!props.label || slots.default.isExist()) && (
                                <div className="pl-alert-label">
                                    {slots.default(props.label)}
                                </div>
                            )}
                            {(!!props.desc || slots.desc.isExist()) && (
                                <div className="pl-alert-desc">
                                    {slots.desc(props.desc)}
                                </div>
                            )}
                        </div>
                    </div>}
                </PlCollapseTransition>
            )
        }

    },
})

export default PlAlert