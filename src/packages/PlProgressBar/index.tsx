import './progress-bar.scss'
import {computed, designComponent, useRefs} from "plain-design-composition";
import {PROGRESS_DEFAULT_PROPS} from "./progress.utils";
import React from 'react';
import PlIcon from "../PlIcon";

export const PlProgressBar = designComponent({
    name: 'pl-progress-bar',
    props: {
        ...PROGRESS_DEFAULT_PROPS,

        width: {type: String, default: '300px'},
        height: {type: String, default: '6px'},
        inlineText: {type: Boolean},
    },
    inheritPropsType: HTMLDivElement,
    setup({props}) {

        const {refs, onRef} = useRefs({el: HTMLDivElement})

        const iconColor = computed(() => {
            switch (props.status) {
                case 'success':
                    return props.successColor
                case 'error':
                    return props.errorColor
                default:
                    return null
            }
        })

        const outerStyles = computed(() => ({
            height: !!props.inlineText ? '16px' : props.height,
            width: props.width,
            backgroundColor: props.outerColor,
            borderRadius: props.width,
        }))

        const innerStyles = computed(() => ({
            width: `${props.modelValue}%`,
            backgroundColor: iconColor.value || props.innerColor,
            borderRadius: props.width,
        }))

        return {
            refer: {refs},
            render: () => (
                <div className="pl-progress-bar" ref={onRef.el}>
                    <div className="pl-progress-bar-outer" style={outerStyles.value}>
                        <div className="pl-progress-bar-inner" style={innerStyles.value}>
                            {props.inlineText && props.modelValue > 20 && (
                                <div>
                                    <div className="pl-progress-bar-content">
                                        {props.status === 'success' && <PlIcon icon="el-icon-check-bold" className="pl-progress-bar-icon-success" style={{color: 'white'}}/>}
                                        {props.status === 'error' && <PlIcon icon="el-icon-close-bold" className="pl-progress-bar-icon-error" style={{color: 'white'}}/>}
                                        {props.status !== 'success' && props.status !== 'error' && <span>{props.modelValue}%</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                        {props.inlineText && props.modelValue < 20 && (
                            <div>
                                <div className="pl-progress-bar-content">
                                    {props.status === 'success' && <PlIcon icon="el-icon-check-bold" className="pl-progress-bar-icon-success" style={{color: props.successColor}}/>}
                                    {props.status === 'error' && <PlIcon icon="el-icon-close-bold" className="pl-progress-bar-icon-error" style={{color: props.errorColor}}/>}
                                    {props.status !== 'success' && props.status !== 'error' && <span>{props.modelValue}%</span>}
                                </div>
                            </div>
                        )}
                    </div>
                    {
                        !props.inlineText && (
                            <div className="pl-progress-bar-content">
                                {props.status === 'success' && <PlIcon icon="el-icon-success" className="pl-progress-bar-icon-success" style={{color: props.successColor}}/>}
                                {props.status === 'error' && <PlIcon icon="el-icon-error" className="pl-progress-bar-icon-error" style={{color: props.errorColor}}/>}
                                {props.status !== 'success' && props.status !== 'error' && <span>{props.modelValue}%</span>}
                            </div>
                        )
                    }
                </div>
            )
        }
    },
})

export default PlProgressBar