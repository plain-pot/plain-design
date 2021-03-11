import React from "react";
import {reactive, watch} from "vue";
import {designComponent} from "../../composition";
import {useMounted} from "../../use/useMounted";
import {useStyles} from "../../use/useStyles";

const Child = designComponent({
    setup() {
        const isMounted = useMounted()

        watch(() => isMounted.value, () => {
            console.log('isMounted', isMounted.value)
        }, {immediate: true})

        return () => (
            <div>
                isMounted:{String(isMounted.value)}
            </div>
        )
    },
})

export const DemoUseMounted = designComponent({
    setup() {

        const state = reactive({
            show: false
        })

        const styles = useStyles(styles => {
            styles.height = 100
        })

        return () => {
            return (
                <div>
                    <button style={styles.value} onClick={() => state.show = !state.show}>show:{String(state.show)}</button>
                    {!!state.show && <Child/>}
                </div>
            )
        }
    },
})