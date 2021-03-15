import {designComponent} from 'plain-design-composition'
import React from 'react';
import {reactive} from '@vue/reactivity';
import {watch} from '@vue/runtime-core'
import {Router} from "./navigator.utils";

export const AppNavigator = designComponent({
    setup() {

        const state = reactive({
            Page: null as any
        })

        watch(() => Router.route.path, async (path) => {
            if (!path) path = 'normal/DemoButton'
            if (path.charAt(0) === '/') {path = path.slice(1)}

            state.Page = (await import('../pages/' + path)).default
        }, {immediate: true})

        return () => (
            <div className="app-navigator">
                {!!state.Page && <state.Page/>}
            </div>
        )
    },
})