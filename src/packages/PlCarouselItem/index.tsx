import {computed, designComponent, useRefs, useStyles} from "plain-design-composition";
import {createCounter} from "plain-design-composition";
import React from "react";
import {CarouselCollector} from "../PlCarousel";
import {useClasses} from "plain-design-composition";

const counter = createCounter('carousel')

export const PlCarouselItem = designComponent({
    name: 'pl-carousel-item',
    props: {
        val: {type: [String, Number]},
    },
    inheritPropsType: HTMLDivElement,
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })
        const carousel = CarouselCollector.child({sort: () => refs.el!})
        const itemVal = computed(() => props.val == null ? counter() : props.val)
        const styles = useStyles(() => carousel.utils.getItemStyles(itemVal.value) as any)

        const classes = useClasses(() => [
            'pl-carousel-item',
            {'pl-carousel-item-animating': carousel.utils.isAnimating(itemVal.value),}
        ])

        return {
            refer: {
                itemVal,
                refs,
            },
            render: () => {
                return (
                    <div className={classes.value}
                         ref={onRef.el}
                         style={styles.value}>
                        {slots.default()}
                    </div>
                )
            }
        }
    },
})

export default PlCarouselItem