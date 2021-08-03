import {designComponent, reactive, watch} from 'plain-design-composition'
import React from 'react';
import {Router} from "./navigator.utils";

export const AppNavigator = designComponent({
    setup() {

        const state = reactive({
            Page: null as any
        })

        watch(() => Router.route.path, async (path) => {
            if (!path) path = 'normal/DemoButton'
            if (path.charAt(0) === '/') {path = path.slice(1)}

            const Components = Object.values(await import('../pages/' + path)) as any[]
            state.Page = Components.map((Component, index) => (
                <React.Fragment key={index}>
                    <Component/>
                </React.Fragment>
            ))
        }, {immediate: true})

        return () => (
            <div className="app-navigator">
                {state.Page}
            </div>
        )
    },
})
