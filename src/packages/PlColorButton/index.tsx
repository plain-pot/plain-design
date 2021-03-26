import {designComponent} from 'plain-design-composition'
import React from 'react'
import './color-button.scss'

const opacityBg = require('./sub/opacity.png')

export const PlColorButton = designComponent({
    name: 'pl-color-button',
    props: {
        color: {type: String}
    },
    emits: {
        onClick: (e: React.MouseEvent) => true,
    },
    setup({props, event: {emit}}) {
        return {
            render: () => (
                <div className="pl-color-button" onClick={emit.onClick}>
                    <div className="pl-color-button-background" style={{backgroundImage: `url(${opacityBg})`}}>
                        <div className="pl-color-button-color" style={{backgroundColor: props.color}}/>
                    </div>
                </div>
            )
        }
    },
})

export default PlColorButton