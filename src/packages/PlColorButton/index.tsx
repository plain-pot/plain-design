import {designComponent, useRefs} from 'plain-design-composition'
import React from 'react'
import './color-button.scss'
// @ts-ignore
import opacityPng from './opacity.png'

export const PlColorButton = designComponent({
    name: 'pl-color-button',
    props: {
        color: {type: String}
    },
    emits: {
        onClick: (e: React.MouseEvent) => true,
    },
    inheritPropsType: HTMLDivElement,
    setup({props, event: {emit}}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })

        return {
            refer: {
                refs,
            },
            render: () => (
                <div className="pl-color-button" onClick={emit.onClick} ref={onRef.el}>
                    <div className="pl-color-button-background" style={{backgroundImage: `url(${opacityPng})`}}>
                        <div className="pl-color-button-color" style={{backgroundColor: props.color}}/>
                    </div>
                </div>
            )
        }
    },
})

export default PlColorButton