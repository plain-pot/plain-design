import {computed, designComponent, inject, provide} from 'plain-design-composition'
import './button-group.scss'
import {DEFAULT_STATUS, StyleMode, StyleProps, useStyle} from "../../use/useStyle";
import {EditProps, useEdit} from "../../use/useEdit";
import useClass from "plain-design-composition/src/use/useClasses";
import React from 'react';

interface ButtonModeProviderValue {
    value: { mode: string }
}

export const BUTTON_GROUP_PROVIDER = '@@BUTTON_GROUP_PROVIDER'

export const ButtonModeProvider = (() => {
    return {
        provide: (data: ButtonModeProviderValue) => {
            provide(BUTTON_GROUP_PROVIDER, data)
        },
        inject: () => {
            return inject(BUTTON_GROUP_PROVIDER, null) as ButtonModeProviderValue | null
        }
    }
})()

export const PlButtonGroup = designComponent({
    name: 'pl-button-group',
    props: {
        mode: {type: String, default: StyleMode.fill},                  // fill,stroke,text
        vertical: {type: Boolean},                                      // 是否为纵向按钮组

        ...EditProps,
        ...StyleProps,
    },
    slots: ['default'],
    setup({props, slots}) {
        const {styleComputed} = useStyle({status: DEFAULT_STATUS})
        const {editComputed} = useEdit()

        const parentGroup = ButtonModeProvider.inject()
        const otherComputed = computed(() => ({mode: !!parentGroup ? parentGroup.value.mode : props.mode}))
        ButtonModeProvider.provide(otherComputed)

        const classes = useClass(() => ([
            `pl-button-group`,
            `pl-button-group-status-${styleComputed.value.status}`,
            `pl-button-group-mode-${otherComputed.value.mode}`,
            `pl-button-group-shape-${styleComputed.value.shape}`,
            `pl-button-group-size-${styleComputed.value.size}`,
            `pl-button-group-direction-${props.vertical ? 'vertical' : 'horizontal'}`,
            {
                'pl-button-group-disabled': !!editComputed.value.disabled,
            },
        ]))

        return {
            render: () => (
                <div className={classes.value}>
                    {slots.default()}
                </div>
            )
        }
    },
})

export default PlButtonGroup