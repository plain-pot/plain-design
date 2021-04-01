import {designComponent, ref, watch} from 'plain-design-composition'
import './icon.scss'
import React, {ReactNode} from "react";
import useClass from 'plain-design-composition/src/use/useClasses';
import {refreshPopperReference} from "../PlPopper/refershPopperReference";

interface IconGetter {
    (icon: string): ReactNode | Promise<ReactNode>
}

/**
 * prefix必须为全小写，可以有横杠下划线
 * @author  韦胜健
 * @date    2020/11/1 12:59
 */
const registry = (() => {
    const icons: { prefix: string, getter: IconGetter }[] = []
    return Object.assign((prefix: string, getter: IconGetter) => {
        icons.unshift({prefix, getter})
    }, {
        icons,
    })
})()

registry('el-icon-', async (icon) => {
    try {
        const module = await import('./icons/' + icon + '.json')
        // console.log(module)
        return (
            <svg {...{
                dangerouslySetInnerHTML: {__html: module.default[0],},
                className: `el-svg-icon ${icon}`,
                viewBox: "0 0 1024 1024",
                version: "1.1",
                xmlns: "http://www.w3.org/2000/svg",
            }}/>
        )
    } catch (e) {
        console.error(e)
        throw e
    }
})

export const PlIcon = designComponent({
    props: {
        icon: {type: String},                       // 图标名称
        status: {type: String},                     // 图标状态
    },
    expose: {registry},
    setup({props}) {
        const icon = ref(null as any)
        const {freshPopperReference} = refreshPopperReference.inject()

        const classes = useClass(() => [
            'pl-icon',
            {
                [`pl-icon-status-${props.status}`]: !!props.status
            }
        ])

        const utils = {
            getIconVNode: async (iconName: string) => {
                for (let i = 0; i < registry.icons.length; i++) {
                    const registryIcon = registry.icons[i];
                    if (iconName.indexOf(registryIcon.prefix) === 0) {
                        return await registryIcon.getter(iconName)
                    }
                }
                return null
            },
            reset: async (iconName: string) => {
                const Icon = await utils.getIconVNode(iconName)
                icon.value = Icon || null
                freshPopperReference()
            }
        }

        watch(() => props.icon, val => !!val && utils.reset(val), {immediate: true})

        return () => {
            const {value: Icon} = icon
            return !!Icon ? {
                ...Icon,
                props: {
                    ...Icon.props,
                    className: `${Icon.props.className || ''} ${classes.value}`
                },
            } : <i className="PlIcon"/>
        }
    },
})

export default PlIcon