import './triangle.scss'
import {designComponent, onMounted, useModel, useRefs, useStyles} from "plain-design-composition";
import {useClasses} from "plain-design-composition";
import {unit} from "plain-utils/string/unit";
import React from 'react';

const DirectionMap = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
}

function uppercaseFirstLetter(name: string): string {
    if (!name) return name
    return name.charAt(0).toUpperCase() + name.slice(1)
}

export const PlTriangle = designComponent({
    name: 'pl-triangle',
    props: {
        direction: {type: String, default: 'top'},
        half: {type: String},
        size: {type: [Number], default: 20},
    },
    inheritPropsType: HTMLElement,
    setup({props}) {
        const {refs, onRef} = useRefs({
            el: HTMLElement,
        })

        const size = useModel(() => props.size, () => {})

        const classes = useClasses(() => [
            'pl-triangle',
            `pl-triangle-direction-${props.direction}`,
            {
                [`pl-triangle-half-${props.half}`]: !!props.half
            }
        ])

        const styles = useStyles(style => {
            if (!props.half) {
                return style
            }
            if (props.direction === 'top' || props.direction === 'bottom') {
                style.width = unit(size.value)
            } else {
                style.height = unit(size.value)
            }
            return style
        })

        const targetStyles = useStyles((style: any) => {

            style.border = `solid transparent ${unit(size.value)}`
            style[`border${uppercaseFirstLetter(props.direction)}Width`] = '0'
            style[`border${uppercaseFirstLetter((DirectionMap as any)[props.direction])}Color`] = 'currentColor'

            if (!!props.half) {
                if (props.direction === 'top' || props.direction === 'bottom') {
                    props.half === 'end' && (style.right = unit(size.value))
                } else {
                    props.half === 'end' && (style.bottom = unit(size.value))
                }
            }

            return style
        })

        if (size.value == null) {
            onMounted(() => {
                size.value = (refs.el!.parentNode as HTMLDivElement).offsetHeight / 2
            })
        }

        return {
            refer: {refs},
            render: () => (
                size.value == null ? <span ref={onRef.el} style={{display: 'none'}}/> : (
                    <div className={classes.value} style={styles.value} ref={onRef.el}>
                        <div className="pl-triangle-target" style={targetStyles.value}/>
                    </div>
                )
            )
        }
    },
})

export default PlTriangle