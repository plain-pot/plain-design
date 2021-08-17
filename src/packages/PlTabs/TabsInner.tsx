import {designComponent, PropType, reactive, useStyles, watch} from "plain-design-composition";
import {PlTabComponent} from "../PlTab";
import {nextTick} from "../../utils/nextTick";
import React from "react";

export const PlTabsInner = designComponent({
    props: {
        item: {type: Object as PropType<PlTabComponent>, required: true},
        active: {type: Boolean},
    },
    setup({props}) {

        const state = reactive({
            show: false,
            init: props.item.props.init,
        })

        const methods = {
            show: async () => {
                if (state.show) return
                else {
                    if (!state.init) {
                        state.init = true
                        await nextTick()
                    }
                    state.show = true
                }
            },
            hide: async () => {
                if (!state.show) return
                else {
                    state.show = false
                    if (props.item!.props.destroyOnHide) {
                        await nextTick()
                        state.init = false
                    }
                }
            }
        }

        watch(() => props.active, async (val) => {val ? await methods.show() : await methods.hide()}, {immediate: true})

        const styles = useStyles((styles) => {
            if (!props.active) {
                styles.display = 'none'
            }
        })

        return {
            render: () => (
                <div className="pl-inner-tab" style={styles.value}>
                    {!!state.init && props.item.slots.default()}
                </div>
            )
        }
    },
})