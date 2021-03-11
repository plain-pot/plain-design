import {designComponent} from 'plain-design-composition'
import React from 'react';

export type AppRoute = {
    path: string,
    hash: string,
}

export function getRoute(): AppRoute {
    let uri = decodeURIComponent(window.location.hash || '')
    if (uri.charAt(0) === '#' && uri.length > 0) {
        uri = uri.substring(1)
    }
    let [path, hash] = uri.split('#')
    if (!!path && path.charAt(0) === '/') {
        path = path.slice(1)
    }
    return {
        path,
        hash,
    }
}

export const AppNavigator = designComponent({
    slots: ['default'],
    setup({props, slots}) {

        const pathChangeListener = [] as ((route: AppRoute) => void)[]
        const hashChangeListener = [] as ((route: AppRoute) => void)[]
        const pageReadyListener = [] as ((route: AppRoute) => void)[]

        return () => (
            slots.default()
        )
    },
})