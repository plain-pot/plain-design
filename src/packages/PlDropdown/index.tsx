import './dropdown.scss'
import {designComponent, reactive, useModel} from "plain-design-composition";
import {PlPopper} from "../PlPopper";
import React from 'react';

export const PlDropdown = designComponent({
    name: 'pl-dropdown',
    inheritPropsType: PlPopper,
    props: {
        modelValue: {type: Boolean},
        disabledHideOnClickOption: {type: Boolean},                     // 禁用点击 dropdown-option 之后关闭 dropdown
    },
    provideRefer: true,
    emits: {
        onUpdateModelValue: (val?: boolean) => true,
    },
    slots: ['popper', 'default'],
    scopeSlots: {
        reference: (scope: { open?: boolean }) => {},
    },
    setup({props, slots, scopeSlots, event: {emit}}) {

        const model = useModel(() => props.modelValue, emit.onUpdateModelValue)

        const state = reactive({})

        const handler = {
            clickDropdownOption: (e: React.MouseEvent) => {
                if (!props.disabledHideOnClickOption) {
                    model.value = false
                }
            }
        }

        return {
            refer: {
                state,
                handler,
            },
            render: () => (
                <PlPopper
                    trigger="click"
                    v-model={model.value}
                    noContentPadding
                    transition="pl-transition-popper-drop">
                    {{
                        popper: slots.popper,
                        default: scopeSlots.reference({open: model.value}, slots.default())
                    }}
                </PlPopper>
            )
        }
    },
})

export default PlDropdown