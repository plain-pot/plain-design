import {designComponent, useRefs, watch} from "plain-design-composition";
import {PlainLoading} from "plain-loading";
import {delay} from "plain-utils/utils/delay";
import React from "react";
import useClass from "plain-design-composition/src/use/useClasses";
import './loading.scss'

export const PlLoading = designComponent({
        props: {
            type: {type: String, default: 'alpha'},
            status: {type: String, default: null},
        },
        setup({props}) {

            const {refs, onRef} = useRefs({el: HTMLElement})

            const classes = useClass(() => [
                'pl-loading',
                !!props.status ? `pl-loading-status-${props.status}` : null,
            ])

            watch(() => props.type, async val => {
                if (!val) {
                    return !!refs.el && (refs.el.innerHTML = '')
                }
                await delay(23)
                if (!(PlainLoading as any)[val]) {
                    throw new Error(`pl-loading: un recognise type:${val}`)
                }
                !!refs.el && (refs.el!.innerHTML = (PlainLoading as any)[val]().outerHTML)
            }, {immediate: true})

            return {
                refer: {
                    refs,
                },
                render: () => {
                    return <i className={classes.value} ref={onRef.el}/>
                }
            }
        },
    }
)

export default PlLoading