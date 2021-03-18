import {designComponent, useReference, watch} from "plain-design-composition";
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

            const el = useReference<HTMLElement>()

            const classes = useClass(() => [
                'pl-loading',
                !!props.status ? `pl-loading-status-${props.status}` : null,
            ])

            watch(() => props.type, async val => {
                if (!val) {
                    return !!el.current && (el.current.innerHTML = '')
                }
                await delay(23)
                if (!(PlainLoading as any)[val]) {
                    throw new Error(`pl-loading: un recognise type:${val}`)
                }
                !!el.current && (el.current.innerHTML = (PlainLoading as any)[val]().outerHTML)
            }, {immediate: true})

            return {
                render: () => {
                    return <i className={classes.value} ref={el}/>
                }
            }
        },
    }
)

export default PlLoading