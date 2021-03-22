import {computed, designComponent, useRefs, useStyles} from "plain-design-composition";
import {createCounter} from "plain-design-composition/src/utils/createCounter";
import React from "react";
import {CarouselCollector} from "../PlCarousel";
import useClass from "plain-design-composition/src/use/useClasses";

const counter = createCounter('carousel')

export const PlCarouselItem = designComponent({
    name: 'pl-carousel-item',
    props: {
        val: {type: [String, Number]},
    },
    slots: ['default'],
    setup({props, slots}) {

        const {refs, onRef} = useRefs({
            el: HTMLDivElement,
        })
        const carousel = CarouselCollector.child({sort: () => refs.el!})
        const itemVal = computed(() => props.val == null ? counter() : props.val)
        const styles = useStyles(() => carousel.utils.getItemStyles(itemVal.value) as any)

        const classes = useClass(() => [
            'pl-carousel-item',
            {'pl-carousel-item-animating': carousel.utils.isAnimating(itemVal.value),}
        ])

        return {
            refer: {
                itemVal,
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